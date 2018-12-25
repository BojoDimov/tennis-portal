const { Status, SchemeType } = require('../infrastructure/enums');
const moment = require('moment-timezone');

module.exports = (db, Sequelize) => {
  const Schemes = db.define('Schemes', {
    name: { type: Sequelize.STRING, allowNull: false },
    info: Sequelize.TEXT,
    date: { type: Sequelize.DATEONLY, allowNull: false },
    singleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    maleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    femaleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    mixedTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    ageFrom: Sequelize.INTEGER,
    ageTo: Sequelize.INTEGER,
    maxPlayerCount: Sequelize.INTEGER,
    groupCount: Sequelize.INTEGER,
    teamsPerGroup: Sequelize.INTEGER,
    registrationStart: {
      type: Sequelize.DATE,
      allowNull: false,
      // get: function () {
      //   return moment(this.getDataValue('registrationStart')).format('YYYY-MM-DDTHH:mm');
      // }
    },
    registrationEnd: {
      type: Sequelize.DATE,
      allowNull: false,
      // get: function () {
      //   return moment(this.getDataValue('registrationEnd')).format('YYYY-MM-DDTHH:mm');
      // }
    },
    hasGroupPhase: { type: Sequelize.BOOLEAN, allowNull: false },
    status: {
      type: Sequelize.ENUM, allowNull: false,
      values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE]
    },
    schemeType: {
      type: Sequelize.ENUM, allowNull: false,
      values: [SchemeType.ELIMINATION, SchemeType.GROUP]
    },
    pPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    wPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    cPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
  }, {
      validate: {
        // mixedSingleTeams() {
        //   if (this.singleTeams && this.mixedTeams)
        //     throw new Error('Cannot have mixed teams when the scheme is for single teams');
        // },
        // ageFromTo() {
        //   if (this.ageFrom && this.ageTo && this.ageFrom > this.ageTo)
        //     throw new Error('Age from must be <= Age to');
        // },
        // registrationStartEnd() {
        //   if (new Date(this.registrationStart) > new Date(this.registrationEnd))
        //     throw new Error('Registration start date cannot be after registration end date');
        // },
        // tournamentDate() {
        //   if (this.date < new Date(this.registrationStart))
        //     throw new Error('Tournament start cannot be before registration start date');
        // },
        // schemeFormat() {
        //   if (!this.maleTeams && !this.femaleTeams && !this.mixedTeams)
        //     throw new Error('');
        // },
        // eTeamCount() {
        //   if (this.schemeType == ELIMINATION && !this.maxPlayerCount)
        //     throw new Error();
        // },
        // gCount() {
        //   if (this.schemeType == GROUP && !this.groupCount)
        //     throw new Error();
        // },
        // rrTeamCount() {
        //   if (this.schemeType == GROUP && !this.teamsPerGroup)
        //     throw new Error();
        // },
        // groupPhase() {
        //   if (!this.groupPhaseId && this.hasGroupPhase)
        //     throw new Error();
        // }
      }
    });

  Schemes.associate = (models) => {
    models.Schemes.belongsTo(models.Editions, {
      as: 'edition',
      foreignKey: {
        name: 'editionId',
        allowNull: false
      }
    });

    models.Schemes.belongsTo(models.Schemes, {
      as: 'groupPhase',
      foreignKey: {
        name: 'groupPhaseId',
        allowNull: true
      }
    });

    models.Schemes.hasMany(models.Matches, {
      as: 'matches',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });
  };

  return Schemes;
}