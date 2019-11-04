const { Teams, Users } = require('../db');
Teams.getAggregateRoot = function () {
  return [
    { model: Users, as: 'user1', attributes: ['name', 'gender', 'birthDate'] },
    { model: Users, as: 'user2', attributes: ['name', 'gender', 'birthDate'] }
  ];
}

Teams.getRestrictedAggregateRoot = function () {
  return [
    { model: Users, as: 'user1', attributes: ['name'] },
    { model: Users, as: 'user2', attributes: ['name'] }
  ];
}

module.exports = Teams;