const { Groups, GroupTeams, Matches, Sets, Teams, Users, sequelize } = require('../db');

class GroupsService {
  async fixOrder(group, transaction) {
    for (let i = 0; i < group.teams.length; i++) {
      group.teams[i].order = i + 1;
      await group.teams[i].save({ transaction });
    }
  }

  get(id) {
    return Groups.findById(id, {
      include: [
        {
          model: GroupTeams, as: 'teams',
          include: [
            { model: Teams, as: 'team' }
          ]
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
      await this.fixOrder(group);
      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new GroupsService();