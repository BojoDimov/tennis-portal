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
  info: Sequelize.TEXT,
  status: {
    type: Sequelize.ENUM,
    values: ['draft', 'published', 'inactive'],
    allowNull: false
  }
});

const TournamentEditions = db.define('TournamentEditions', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  info: Sequelize.TEXT,
  startDate: Sequelize.DATEONLY,
  endDate: Sequelize.DATEONLY,
  status: {
    type: Sequelize.ENUM,
    values: ['draft', 'published', 'inactive'],
    allowNull: false
  }
}, {
    validate: {
      startDateEndDate() {
        if (this.startDate > this.endDate)
          throw new Error("Start date cannot be after end date");
      }
    }
  });

const TournamentSchemes = db.define('TournamentSchemes', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  info: Sequelize.TEXT,
  date: { type: Sequelize.DATEONLY, allowNull: false },
  singleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  maleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  femaleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  mixedTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  ageFrom: Sequelize.INTEGER,
  ageTo: Sequelize.INTEGER,
  maxPlayerCount: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 4, max: 128 } },
  registrationStart: { type: Sequelize.DATEONLY, allowNull: false },
  registrationEnd: { type: Sequelize.DATEONLY, allowNull: false },
  hasGroupPhase: { type: Sequelize.BOOLEAN, allowNull: false },
  status: {
    type: Sequelize.ENUM,
    values: ['draft', 'published', 'inactive'],
    allowNull: false
  }
}, {
    validate: {
      mixedSingleTeams() {
        if (this.singleTeams && this.mixedTeams)
          return new Error('Cannot have mixed teams when the scheme is for single teams');
      },
      ageFromTo() {
        if (this.ageFrom > this.ageTo)
          return new Error('Age from must be <= Age to');
      },
      registrationStartEnd() {
        if (this.registrationStart > this.registrationEnd)
          return new Error('Registration start date cannot be after registration end date');
      },
      tournamentDate() {
        if (this.date < this.registartionStart)
          return new Error('Tournament start cannot be before registration start date');
      }
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

TournamentSchemes.belongsTo(TournamentEditions, {
  foreignKey: {
    name: 'tournamentEditionId',
    allowNull: false
  }
});

module.exports = {
  Tournaments, TournamentEditions, TournamentSchemes,
  init: function () {
    return db.sync().then(() => process.exit);
  }
};