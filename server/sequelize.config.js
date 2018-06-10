const Sequelize = require('sequelize');

const db = new Sequelize('tennis-portal-db', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const Users = db.import(__dirname + '/db/users.js');
const Logs = db.import(__dirname + '/db/logs.js');
const Tokens = db.import(__dirname + '/db/tokens.js');
const Tournaments = db.import(__dirname + '/db/tournaments.js');
const TournamentEditions = db.import(__dirname + '/db/tournamentEditions.js');
const TournamentSchemes = db.import(__dirname + '/db/tournamentSchemes.js');

Users.hasOne(Tokens, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Tournaments.hasMany(TournamentEditions, {
  as: 'TournamentEditions',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

TournamentEditions.belongsTo(Tournaments, {
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

TournamentEditions.hasMany(TournamentSchemes, {
  as: 'TournamentSchemes',
  foreignKey: {
    name: 'tournamentEditionId',
    allowNull: false
  }
});

TournamentSchemes.belongsTo(TournamentEditions, {
  foreignKey: {
    name: 'tournamentEditionId',
    allowNull: false
  }
});

module.exports = {
  Tournaments, TournamentEditions, TournamentSchemes,
  Users, Tokens,
  Logs,
  init: function () {
    return db.sync().then(() => process.exit());
  }
};