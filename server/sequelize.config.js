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
const SchemeEnrollments = db.import(__dirname + '/db/schemeEnrollments.js');
const Rankings = db.import(__dirname + '/db/rankings.js');
const Matches = db.import(__dirname + '/db/matches.js');

Users.hasOne(Tokens, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Users.hasMany(Rankings, {
  as: 'ranking',
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Tournaments.hasMany(TournamentEditions, {
  as: 'editions',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

Tournaments.hasMany(Rankings, {
  as: 'ranking',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

Rankings.belongsTo(Users, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Rankings.belongsTo(Tournaments, {
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
  as: 'schemes',
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

TournamentSchemes.hasMany(SchemeEnrollments, {
  as: 'enrollments',
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

SchemeEnrollments.belongsTo(Users, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

SchemeEnrollments.belongsTo(TournamentSchemes, {
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

Matches.belongsTo(Users, {
  as: 'team1',
  foreignKey: {
    name: 'team1Id',
    allowNull: true
  }
});

Matches.belongsTo(Users, {
  as: 'team2',
  foreignKey: {
    name: 'team2Id',
    allowNull: true
  }
});

TournamentSchemes.hasMany(Matches, {
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

module.exports = {
  Tournaments, TournamentEditions, TournamentSchemes,
  Users, Tokens, SchemeEnrollments, Rankings, Matches,
  Logs,
  db,
  init: function () {
    return db.sync().then(() => process.exit());
  }
};