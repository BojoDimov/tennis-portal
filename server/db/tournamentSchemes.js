module.exports = (db, Sequelize) => {
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
    maxPlayerCount: { type: Sequelize.INTEGER, allowNull: true },
    groupCount: { type: Sequelize.INTEGER, allowNull: true },
    teamsPerGroup: { type: Sequelize.INTEGER, allowNull: true },
    registrationStart: { type: Sequelize.DATE, allowNull: false },
    registrationEnd: { type: Sequelize.DATE, allowNull: false },
    hasGroupPhase: { type: Sequelize.BOOLEAN, allowNull: false },
    status: {
      type: Sequelize.ENUM,
      values: ['draft', 'published', 'inactive'],
      allowNull: false
    },
    schemeType: {
      type: Sequelize.ENUM,
      values: ['elimination', 'round-robin'],
      allowNull: false
    },
    pPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    wPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    cPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false }
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
        schemeFormat() {
          if (!this.maleTeams && !this.femaleTeams && !this.mixedTeams)
            throw new Error('');
        },
        eTeamCount() {
          if (this.schemeType == 'elimination' && !this.maxPlayerCount)
            throw new Error();
        },
        gCount() {
          if (this.schemeType == 'round-robin' && !this.groupCount)
            throw new Error();
        },
        rrTeamCount() {
          if (this.schemeType == 'round-robin' && !this.teamsPerGroup)
            throw new Error();
        },
        groupPhase() {
          if (!this.groupPhaseId && this.hasGroupPhase)
            throw new Error();
        }
      }
    });

  TournamentSchemes.associate = (models) => {
    models.TournamentSchemes.belongsTo(models.TournamentEditions, {
      foreignKey: {
        name: 'tournamentEditionId',
        allowNull: false
      }
    });

    models.TournamentSchemes.hasMany(models.SchemeEnrollments, {
      as: 'enrollments',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });

    models.TournamentSchemes.hasMany(models.EnrollmentQueues, {
      as: 'EnrollmentQueues',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });

    models.TournamentSchemes.hasOne(models.TournamentSchemes, {
      foreignKey: {
        name: 'groupPhaseId',
        allowNull: true
      }
    });

    models.TournamentSchemes.hasMany(models.Matches, {
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });
  }

  return TournamentSchemes;
}