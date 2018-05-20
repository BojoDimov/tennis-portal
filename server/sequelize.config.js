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

const Logs = db.define('Logs', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip: Sequelize.STRING,
  path: Sequelize.STRING,
  method: Sequelize.STRING,
  body: Sequelize.TEXT,
  params: Sequelize.TEXT,
  query: Sequelize.TEXT,
  error: Sequelize.TEXT
});

const Tournaments = db.define('Tournaments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  info: Sequelize.TEXT,
  status: {
    type: Sequelize.ENUM,
    values: ['draft', 'published', 'inactive'],
    allowNull: false
  }
});

const TournamentEditions = db.define('TournamentEditions', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
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

const Users = db.define('Users', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  passwordHash: { type: Sequelize.STRING(40), allowNull: false },
  passwordSalt: { type: Sequelize.STRING(16), allowNull: false },
  fullname: { type: Sequelize.STRING, allowNull: false },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  telephone: Sequelize.STRING,
  gender: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['male', 'female']
  }
});

const Tokens = db.define('Tokens', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  token: Sequelize.STRING(40),
  expires: Sequelize.DATE,
  issued: Sequelize.STRING
});

const TournamentSchemes = db.define('TournamentSchemes', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  info: Sequelize.TEXT,
  date: { type: Sequelize.DATEONLY, allowNull: false },
  singleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  maleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  femaleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  mixedTeams: { type: Sequelize.BOOLEAN, allowNull: false },
  ageFrom: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
  ageTo: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
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
          throw new Error('Cannot have mixed teams when the scheme is for single teams');
      },
      ageFromTo() {
        if (this.ageFrom > this.ageTo)
          throw new Error('Age from must be <= Age to');
      },
      registrationStartEnd() {
        if (this.registrationStart > this.registrationEnd)
          throw new Error('Registration start date cannot be after registration end date');
      },
      tournamentDate() {
        if (this.date < this.registrationStart)
          throw new Error('Tournament start cannot be before registration start date');
      },
      schemeType() {
        if (!this.maleTeams && !this.femaleTeams && !this.mixedTeams)
          throw new Error('');
      }
    }
  });

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
    return db.sync().then(() => process.exit);
  }
};