const { Groups, GroupTeams, Matches, Sets, Teams, sequelize } = require('../db');
const { fixOrder } = require('./group.functions');
const MatchService = require('../match/match.service');

class GroupsService {
  get(id) {
    return Groups.findById(id, {
      include: [
        {
          model: GroupTeams, as: 'teams',
          include: [
            { model: Teams, as: 'team' }
          ]
        },
        {
          model: Matches, as: 'matches',
          include: [{ model: Sets, as: 'sets' }]
        }
      ]
    });
  }

  async create(model) {
    await Groups.create(model, {
      include: [
        'teams',
        'matches'
      ]
    });
  }

  async update(id, model) {
    const group = await this.get(id);
    if (!group)
      throw { name: 'NotFound' };

    if (group.matches && group.matches.length > 0)
      throw { name: 'DomainActionError', error: 'GroupHasMatches' }

    model.teams = model.teams.filter(groupTeam => groupTeam.team);
    const modifications = model.teams.filter(groupTeam => !group.teams.find(e => e.teamId == groupTeam.teamId));
    const deleted = group.teams
      .filter(e => !model.teams.find(groupTeam => groupTeam.id == e.id)
        || modifications.find(groupTeam => groupTeam.id == e.id))
      .map(e => e.id);

    modifications.forEach(gt => {
      gt.groupId = group.id
      gt.id = null
    });

    let transaction;
    try {
      transaction = await sequelize.transaction();
      await GroupTeams.destroy({
        where: {
          id: deleted
        },
        transaction
      });
      await GroupTeams.bulkCreate(modifications, { transaction });
      await group.reload();
      await fixOrder(group, transaction);
      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async delete(id, scheme) {
    const group = await Groups.findById(id, { include: ['matches'] });
    if (!group)
      throw { name: 'NotFound' };

    let transaction;
    try {
      transaction = await sequelize.transaction();

      for (let i = 0; i < group.matches.length; i++)
        await MatchService.delete(group.matches[i].id, scheme, transaction);

      await GroupTeams.destroy({ where: { groupId: id }, transaction });
      await Groups.destroy({ where: { id }, transaction });

      const otherGroups = await Groups
        .findAll({
          where: {
            schemeId: scheme.id
          }
        })
        .filter(e => e.id != id);

      for (let i = 0; i < otherGroups.length; i++)
        await otherGroups[i].update({ group: i }, { transaction });

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new GroupsService();