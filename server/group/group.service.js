const { Groups, GroupTeams, Matches, Sets, Teams, Users } = require('../db');

class GroupsService {
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

  update(group, model) {
    model.teams = model.teams.filter(groupTeam => groupTeam.team);
    const addedTeams = model.teams.filter(groupTeam => !group.teams.find(e => e.teamId == groupTeam.teamId));
    const deletedTeams = group.teams.filter(e => !model.teams.find(groupTeam => groupTeam.id == e.id))
  }
}

module.exports = new GroupsService();