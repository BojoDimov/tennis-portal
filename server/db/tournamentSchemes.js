module.exports = (db, Sequelize) => {
  return db.define('TournamentSchemes', {
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
}