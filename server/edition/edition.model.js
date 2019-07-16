const { Status } = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Editions = db
    .define('Editions', {
      name: { type: Sequelize.STRING, allowNull: false },
      info: Sequelize.TEXT,
      startDate: Sequelize.STRING,
      endDate: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM, allowNull: false,
        values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE]
      }
    });

  Editions.associate = (models) => {
    models.Editions.belongsTo(models.Tournaments, {
      as: 'tournament',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });

    models.Editions.hasMany(models.Schemes, {
      as: 'schemes',
      foreignKey: {
        name: 'editionId',
        allowNull: false
      }
    });
  }

  return Editions;
}