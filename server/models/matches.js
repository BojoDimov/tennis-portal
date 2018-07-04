const { Matches } = require('../db');

Matches.manageNextMatch = function (match, transaction) {
  let winner = Matches.getWinner(match);
  if (!winner)
    return Promise.resolve();

  return Matches
    .findOrCreate({
      where: {
        round: match.round + 1,
        match: Math.ceil(match.match / 2),
        schemeId: match.schemeId
      },
      transaction: transaction
    })
    .then(([nextMatch, _]) => {
      if (match.match % 2 == 0)
        nextMatch.team2Id = winner;
      else
        nextMatch.team1Id = winner;

      return nextMatch.save({ transaction: transaction });
    });
}

Matches.manageSets = function (sets, transaction) {
  //has id but scores are removed => DELETED
  let deleted = sets.filter(set => set.id && !set.team1 && !set.team2);
  //filter empty sets
  sets = sets.filter((set) => (set.team1 || set.team2));
  //parse score inputs
  sets = sets.map(Matches.parseSet);

  //has id => UPDATED
  let updated = sets.filter(set => set.id);

  //doesn't have id => CREATED
  let created = sets.filter(set => !set.id);

  //create sets
  let p1 = Sets.bulkCreate(created, { transaction: transaction });

  //update set results
  let p2 = Sets
    .findAll({
      where: {
        id: updated.map(set => set.id)
      },
      transaction: transaction
    })
    .then(sets => {
      return Promise.all(
        sets.map(
          set => set.update(
            updated.find(e => e.id == set.id), { transaction: transaction })
        )
      );
    });

  //remove sets
  let p3 = Sets
    .destroy({
      where: {
        id: deleted.map(set => set.id)
      },
      transaction: transaction
    });

  return Promise.all([p1, p2, p3]);
}

Matches.getWinner = function (match) {
  let winner = null;

  if (match.withdraw == 1)
    winner = match.team2Id;
  else if (match.withdraw == 2)
    winner = match.team1Id;
  else if (match.sets.length > 0)
    //if there are sets, winner is the one with winning last set
    winner = match.sets[match.sets.length - 1].team1 > match.sets[match.sets.length - 1].team2 ?
      match.team1Id : match.team2Id;

  return winner;
}

Matches.getMatchStatistics = function (match, teamId) {
  let ourTeam = match.team1Id == teamId ? 'team1' : 'team2';
  let oppositeTeam = match.team1Id == teamId ? 'team2' : 'team1';

  return {
    sets: match.sets.length,
    setsWon: match.sets.reduce((acc, next) => (next[ourTeam] > next[oppositeTeam] ? acc + 1 : acc), 0),
    games: match.sets.reduce((acc, next) => acc + next.team1 + next.team2, 0),
    gamesWon: match.sets.reduce((acc, next) => (next[ourTeam] > next[oppositeTeam] ? acc + next[ourTeam] : acc), 0),
    isWinner: Matches.getWinner(match) == teamId
  }
}

Matches.parseSet = function (set) {
  const scoreParser = /^(\d+)(\(\d+\))*$/;

  if (!set.team1 || !set.team2)
    throw { name: 'DomainActionError', message: 'Invalid format: match->set' };

  let t1m = set.team1.toString().match(scoreParser);
  let t2m = set.team2.toString().match(scoreParser);
  if ((t1m[2] && t2m[2]) || t1m.length < 2 || t2m.length < 2)
    throw { name: 'DomainActionError', message: 'Invalid format: match->set' };

  set.team1 = parseInt(t1m[1]);
  set.team2 = parseInt(t2m[1]);

  if (t1m[2])
    set.tiebreaker = parseInt(t1m[2].slice(1, t1m[2].length - 1));
  else if (t2m[2])
    set.tiebreaker = parseInt(t2m[2].slice(1, t2m[2].length - 1));
  else set.tiebreaker = null;

  return set;
}

Matches.formatSet = function (set) {
  if (!set.tiebreaker)
    return set;

  if (set.team1 < set.team2)
    set.team1 = set.team1 + "(" + set.tiebreaker + ")";
  else
    set.team2 = set.team2 + "(" + set.tiebreaker + ")";

  return set;
}

/**
 * Transfer team between SchemeEnrollments and EnrollmentQueues
 * extract this to Teams.transfer
 */
Matches.transfer = function (from, to, schemeId, teamId, transaction) {
  return Promise.all([
    from.destroy({
      where: {
        schemeId: schemeId,
        userId: teamId
      },
      transaction: transaction
    }),
    to.create({
      schemeId: schemeId,
      userId: teamId
    }, { transaction: transaction })
  ]);
}

/**
 * Function to generate points for tournament "Rankings".
 * Matches should be ordered ascending: tournament final should be last.
 * Team1, team2, sets should be included
 */
Matches.generatePoints = function (scheme, matches, hasWinner) {
  let teamPoints = [];
  matches.forEach(match => {
    if (!teamPoints[match.team1Id])
      teamPoints[match.team1Id] = scheme.pPoints;
    if (!teamPoints[match.team2Id])
      teamPoints[match.team2Id] = scheme.pPoints;
  });

  matches.forEach(match => {
    let winner = Matches.getWinner(match);
    teamPoints[winner] += scheme.wPoints;
  });

  //let tournamentWinner = getWinner(matches[matches.length - 1]);
  if (hasWinner)
    teamPoints[matches[matches.length - 1].team1Id] += scheme.cPoints;
  return teamPoints
}