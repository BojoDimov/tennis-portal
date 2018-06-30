const {
  TournamentSchemes,
  Matches, Sets, EnrollmentsQueue, SchemeEnrollments, Users, db
} = require('../sequelize.config');

function transfer(from, to, schemeId, teamId, transaction) {
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

const removeTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return db
    .transaction(function (trn) {
      return Matches
        .findById(req.params.id, {
          include: [
            { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
            { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
          ],
          transaction: trn
        })
        .then(match => {
          let team = null;
          if (pos == 1) {
            team = match.team1;
            match.team1Id = null;
            match.seed1 = null;
          }
          else {
            team = match.team2;
            match.team2Id = null;
            match.seed2 = null;
          }

          let p1 = SchemeEnrollments.destroy({
            where: {
              schemeId: match.schemeId,
              userId: team.id
            },
            transaction: trn
          });

          let p2 = EnrollmentsQueue.create({ schemeId: match.schemeId, userId: team.id }, { transaction: trn });

          let p3 = match.save({ transaction: trn });

          return Promise.all([p1, p2, p3]);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const setTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return Matches
    .findById(req.params.id, {
      include: [
        { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
        { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
      ]
    })
    .then(match => {
      if (pos == 1)
        match.team1Id = req.query['teamId'];
      else
        match.team2Id = req.query['teamId'];

      let p1 = EnrollmentsQueue.destroy({
        where: {
          schemeId: match.schemeId,
          userId: req.query['teamId']
        }
      });

      let p2 = SchemeEnrollments.create({ schemeId: match.schemeId, userId: req.query['teamId'] });

      let p3 = match.save();

      return Promise.all([p1, p2, p3]);
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const addResult = (req, res, next) => {
  let withdraw = req.body.withdraw;
  let matchId = req.params.id;
  let sets = req.body.sets;
  sets.forEach(set => set.matchId = matchId);

  return db
    .transaction(function (trn) {
      return manageSets(sets, trn)
        .then(() => Matches
          .findById(matchId, {
            include: [
              { model: Sets, as: 'sets' },
              { model: TournamentSchemes, as: 'scheme' }
            ],
            order: [
              ['sets', 'order', 'asc']
            ],
            transaction: trn
          })
          .then(match => {
            match.withdraw = withdraw;
            return match.save({ transaction: trn });
          }))
        .then(match => {
          if (match.scheme.schemeType == 'elimination')
            return manageNextMatch(match, trn);
          else return Promise.resolve(match);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const createMatch = (req, res, next) => {
  let match = req.body;
  match.sets = match.sets.filter((set) => (set.team1 || set.team2));
  match.sets = match.sets.map(parseSet);

  return db
    .transaction(function (trn) {
      return Matches.create(match, {
        include: [
          { model: Sets, as: 'sets' }
        ],
        transaction: trn
      })
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

function getWinner(match) {
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

function manageNextMatch(match, transaction) {
  let winner = getWinner(match);
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

function manageSets(sets, transaction) {
  //has id but scores are removed => DELETED
  let deleted = sets.filter(set => set.id && !set.team1 && !set.team2);
  //filter empty sets
  sets = sets.filter((set) => (set.team1 || set.team2));
  //parse score inputs
  sets = sets.map(parseSet);

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

function parseSet(set) {
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

function formatSet(set) {
  if (!set.tiebreaker)
    return set;

  if (set.team1 < set.team2)
    set.team1 = set.team1 + "(" + set.tiebreaker + ")";
  else
    set.team2 = set.team2 + "(" + set.tiebreaker + ")";

  return set;
}

module.exports = {
  init: (app) => {
    app.get('/api/matches/:id/removeTeam', removeTeam);
    app.get('/api/matches/:id/setTeam', setTeam);
    app.post('/api/matches/:id/addResult', addResult);
    app.post('/api/matches/create', createMatch);
  },
  formatSet,
  transfer
};