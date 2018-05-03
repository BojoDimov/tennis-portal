const Sequelize = require('sequelize');

const db = new Sequelize('tennis-portal-db', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const Tournaments = db.define('Tournaments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  info: Sequelize.TEXT
});

const TournamentEditions = db.define('TournamentEditions', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  tournamentId: {
    type: Sequelize.INTEGER,
    references: {
      model: Tournaments,
      key: 'id'
    },
    allowNull: false
  },
  name: { type: Sequelize.STRING, allowNull: false },
  info: Sequelize.TEXT,
  startDate: Sequelize.DATEONLY,
  endDate: Sequelize.DATEONLY
});

const TournamentSchemes = db.define('TournamentSchemes', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  tournamentEditionId: {
    type: Sequelize.INTEGER,
    references: {
      model: TournamentEditions,
      key: 'id'
    },
    allowNull: false
  },
  name: { type: Sequelize.STRING, allowNull: false },
  info: Sequelize.TEXT,
  date: { type: Sequelize.DATEONLY, allowNull: false },
  singleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  maleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  femaleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  mixedTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  ageFrom: Sequelize.INTEGER,
  ageTo: Sequelize.INTEGER,
  maxPlayerCount: { type: Sequelize.INTEGER, allowNull: false },
  registrationStart: { type: Sequelize.DATEONLY, allowNull: false },
  registrationEnd: { type: Sequelize.DATEONLY, allowNull: false },
  hasGroupPhase: { type: Sequelize.BOOLEAN, allowNull: false },
  status: Sequelize.INTEGER
});

db.sync().then(() => process.exit());
module.exports = { Tournaments, TournamentEditions, TournamentSchemes };