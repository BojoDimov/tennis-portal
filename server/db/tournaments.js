const { Status } = require('../enums');

module.exports = (db, Sequelize) => {
  const Tournaments = db.define('Tournaments', {
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
      values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE],
      allowNull: false
    }
  });

  Tournaments.associate = (models) => {
    models.Tournaments.hasMany(models.TournamentEditions, {
      as: 'editions',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });

    models.Tournaments.hasMany(models.Rankings, {
      as: 'ranking',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });
  }

  return Tournaments;
}