const { SubscriptionType } = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Subscriptions = db.define("Subscriptions", {
    totalHours: { type: Sequelize.INTEGER, allowNull: false },
    remainingHours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: [SubscriptionType.ZONE_1, SubscriptionType.ZONE_2]
    }
  });

  Subscriptions.associate = function (models) {
    models.Subscriptions.belongsTo(models.Seasons, {
      as: 'season',
      foreignKey: {
        name: 'seasonId',
        allowNull: false
      }
    });

    models.Subscriptions.belongsTo(models.Users, {
      as: 'administrator',
      foreignKey: {
        name: 'administratorId',
        allowNull: false
      }
    });

    models.Subscriptions.belongsTo(models.Users, {
      as: 'customer',
      foreignKey: {
        name: 'customerId',
        allowNull: true
      }
    });
  }

  return Subscriptions;
}