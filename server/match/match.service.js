const {
  Matches,
  Sets,
  Teams,
  Users,
  sequelize
} = require('../db');

const { SchemeType } = require('../infrastructure/enums');

class MatchesService {
  matchesIncludes() {
    return [
      {
        model: Sets, as: 'sets'
      },
      {
        model: Teams, as: 'team1',
        include: [
          { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
          { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
        ]
      },
      {
        model: Teams, as: 'team2',
        include: [
          { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
          { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
        ]
      }
    ];
  }

  get(id) {
    return Matches
      .findById(id, {
        include: this.matchesIncludes(),
        order: [
          ['sets', 'order', 'asc']
        ]
      });
  }

  async update(id, model, scheme) {
    const match = await this.get(id);
    if (!match)
      throw { name: 'NotFound' };

    let transaction;
    try {
      transaction = await sequelize.transaction({ autocommit: false });

      match.team1Id = model.team1Id;
      match.team2Id = model.team2Id;
      match.withdraw = model.withdraw;
      await this.manageSets(model.sets, transaction);
      await match.save({ transaction });
      if (scheme.schemeType == SchemeType.ELIMINATION)
        await this.manageNextMatch(match, transaction);

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getEliminationMatches(scheme) {
    const matches = await Matches
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: this.matchesIncludes(),
        order: [
          'round', 'match',
          ['sets', 'order', 'asc']
        ]
      });
    return matches;
  }

  getGroupMatches(scheme) {

  }

  getWinner(match) {
    let winner = null;

    if (match.withdraw == 1)
      winner = match.team2Id;
    else if (match.withdraw == 2)
      winner = match.team1Id;
    else if (match.sets.length > 0)
      //if there are sets, winner is the one with winning last set
      winner = match.sets[match.sets.length - 1].team1 > match.sets[match.sets.length - 1].team2 ?
        match.team1Id : match.team2Id;

    if (match.team2Id == null)
      winner = match.team1Id;
    if (match.team1Id == null)
      winner = match.team2Id;
    if (match.team1Id == null && match.team2Id == null)
      winner = null;

    return winner;
  }

  manageNextMatch(match, transaction) {
    let winner = this.getWinner(match);
    if (!winner)
      return;

    return Matches
      .findOrCreate({
        where: {
          round: match.round + 1,
          match: Math.ceil(match.match / 2),
          schemeId: match.schemeId
        },
        transaction
      })
      .then(([nextMatch, _]) => {
        if (match.match % 2 == 0)
          nextMatch.team2Id = winner;
        else
          nextMatch.team1Id = winner;

        return nextMatch.save({ transaction });
      });
  }

  async manageSets(sets, transaction) {
    //has id but scores are removed => DELETED
    let deleted = sets.filter(set => set.id && !set.team1 && !set.team2);
    //filter empty sets
    sets = sets.filter((set) => (set.team1 || set.team2));
    //parse score inputs
    sets = sets.map(this.parseSet);
    //has id => UPDATED
    let updated = sets.filter(set => set.id);
    //doesn't have id => CREATED
    let created = sets.filter(set => !set.id);
    //create sets
    await Sets.bulkCreate(created, { transaction });
    //update set results
    await Sets
      .findAll({
        where: {
          id: updated.map(set => set.id)
        },
        transaction
      })
      .then(sets => {
        return Promise.all(
          sets.map(
            set => set.update(
              updated.find(e => e.id == set.id), { transaction })
          )
        );
      });

    //remove sets
    await Sets
      .destroy({
        where: {
          id: deleted.map(set => set.id)
        },
        transaction
      });
  }

  parseSet(set) {
    const scoreParser = /^(\d+)(\(\d+\))*$/;

    if (!set.team1 || !set.team2)
      throw { name: 'DomainActionError', error: { message: 'Invalid format: match->set' } };

    let t1m = set.team1.toString().match(scoreParser);
    let t2m = set.team2.toString().match(scoreParser);
    if ((t1m[2] && t2m[2]) || t1m.length < 2 || t2m.length < 2)
      throw { name: 'DomainActionError', erorr: { message: 'Invalid format: match->set' } };

    set.team1 = parseInt(t1m[1]);
    set.team2 = parseInt(t2m[1]);

    if (t1m[2])
      set.tiebreaker = parseInt(t1m[2].slice(1, t1m[2].length - 1));
    else if (t2m[2])
      set.tiebreaker = parseInt(t2m[2].slice(1, t2m[2].length - 1));
    else set.tiebreaker = null;

    return set;
  }

  formatSet(set) {
    if (!set.tiebreaker)
      return set;

    if (set.team1 < set.team2)
      set.team1 = set.team1 + "(" + set.tiebreaker + ")";
    else
      set.team2 = set.team2 + "(" + set.tiebreaker + ")";

    return set;
  }
}

module.exports = new MatchesService();