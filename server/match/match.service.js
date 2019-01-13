const {
  Matches,
  Sets,
  Teams,
  Users
} = require('../db');

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

  getAll(schemeId) {
    return Matches
      .findAll({
        where: {
          schemeId: schemeId
        },
        include: this.matchesIncludes()
      });
  }

  create(model) {
    return Matches
      .create(model, {
        include: [{ model: Sets, as: 'sets' }]
      });
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
    const result = [];
    let currentRound = 0;
    matches.forEach(match => {
      if (match.round > currentRound) {
        currentRound++;
        result.push([]);
      }
      result[result.length - 1].push(match);
    });
    return result;
  }

  getGroupMatches(scheme) {

  }
}

module.exports = new MatchesService();