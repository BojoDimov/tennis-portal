const { Groups, GroupTeams } = require('./sequelize.config');
let group = {
  schemeId: 1,
  group: 1,
  teams: [
    { teamId: 45 }
  ]
}

Groups.create(group, {
  include: [
    { model: GroupTeams, as: 'teams' }
  ]
});