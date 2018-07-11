const { Status } = require('../enums');

module.exports = (db, Sequelize) => {
  const TournamentEditions = db
    .define('TournamentEditions', {
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
        values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE],
        allowNull: false
      }
    },
    {
      validate: {
        startDateEndDate() {
          if (this.startDate > this.endDate)
            throw new Error("Start date cannot be after end date");
        }
      }
    });

  TournamentEditions.associate = (models) => {
    models.TournamentEditions.belongsTo(models.Tournaments, {
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });

    models.TournamentEditions.hasMany(models.TournamentSchemes, {
      as: 'schemes',
      foreignKey: {
        name: 'tournamentEditionId',
        allowNull: false
      }
    });
  }

  return TournamentEditions;
}