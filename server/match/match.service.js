const {
  Matches,
  Sets,
  Teams,
  Users
} = require('../db');

class MatchesService {
  getAll(schemeId) {
    return Matches
      .findAll({
        where: {
          schemeId: schemeId
        },
        include: [
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
        ]
      });
  }

  create(model) {
    return Matches
      .create(model, {
        include: [{ model: Sets, as: 'sets' }]
      });
  }
}

module.exports = new MatchesService();