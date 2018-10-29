module.exports = (db, Sequelize) => {
  const Subscriptions = db.define("Subscriptions", {
    hour: { type: Sequelize.INTEGER, allowNull: false },
    unplayedHours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
  });

  Subscriptions.associate = function (models) {
    models.Subscriptions.belongsTo(models.Users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });

    models.Subscriptions.belongsTo(models.Courts, {
      as: 'court',
      foreignKey: {
        name: 'courtId',
        allowNull: false
      }
    });

    models.Subscriptions.belongsTo(models.Seasons, {
      as: 'season',
      foreignKey: {
        name: 'seasonId',
        allowNull: false
      }
    });
  }

  return Subscriptions;
}