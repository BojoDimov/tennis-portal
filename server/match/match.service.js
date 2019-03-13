const {
  Matches,
  Groups,
  GroupTeams,
  Sets,
  Teams,
  Users,
  sequelize
} = require('../db');

const { BracketStatus } = require('../infrastructure/enums');
const { getWinner, parseSet } = require('./match.functions');
const { fixOrder, generateStats } = require('../group/group.functions');

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

  get(id, transaction) {
    return Matches
      .findById(id, {
        include: this.matchesIncludes(),
        order: [
          ['sets', 'order', 'asc']
        ],
        transaction
      });
  }

  async create(model, scheme) {
    model.sets = model.sets.filter((set) => (set.team1 || set.team2)).map(parseSet);
    let transaction;
    try {
      transaction = await sequelize.transaction();
      await Matches.create(model, {
        include: ['sets'],
        transaction
      });

      if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
        await this.manageGroupOrder(model, transaction);

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(id, model, scheme) {
    let match = await this.get(id);
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
      match = await this.get(id, transaction);
      if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
        await this.manageNextMatch(match, transaction);
      if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
        await this.manageGroupOrder(match, transaction);

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async delete(id, scheme, transaction) {
    const match = await Matches.findById(id);
    if (!match)
      throw { name: 'NotFound' };

    const coreDelete = async () => {
      await Sets.destroy({ where: { matchId: id }, transaction });
      await Matches.destroy({ where: { id }, transaction });
      if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
        await this.manageGroupOrder(match, transaction);
    }

    if (!transaction)
      try {
        transaction = await sequelize.transaction();
        await coreDelete();
        await transaction.commit();
      }
      catch (err) {
        await transaction.rollback();
        throw err;
      }
    else
      await coreDelete();
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

  async getGroupMatches(scheme) {
    const groups = await Groups
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          { model: Matches, as: 'matches', include: this.matchesIncludes() },
          {
            model: GroupTeams, as: 'teams',
            include: [{
              model: Teams, as: 'team',
              include: [
                { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
                { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
              ]
            }]
          }
        ],
        order: [
          'group',
          ['teams', 'order', 'asc'],
          ['matches', 'sets', 'order', 'asc']
        ]
      });

    groups.forEach(group => {
      generateStats(group);
      group.test = 'test'
    });
    return groups;
  }

  async manageNextMatch(match, transaction) {
    let winner = getWinner(match);
    if (!winner)
      return;

    const [nextMatch, created] = await Matches.findOrCreate({
      where: {
        round: match.round + 1,
        match: Math.ceil(match.match / 2),
        schemeId: match.schemeId
      },
      transaction
    });

    if (match.match % 2 == 0)
      nextMatch.team2Id = winner;
    else
      nextMatch.team1Id = winner;

    await nextMatch.save({ transaction });
  }

  async manageGroupOrder(match, transaction) {
    const group = await Groups.findById(match.groupId, {
      include: [
        { model: GroupTeams, as: 'teams' },
        {
          model: Matches, as: 'matches',
          include: ['sets']
        }
      ],
      transaction
    });
    await fixOrder(group, transaction);
  }

  async manageSets(sets, transaction) {
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
}

module.exports = new MatchesService();