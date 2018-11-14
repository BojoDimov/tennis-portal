const { ReservationType } = require('../../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Reservations = db.define("Reservations", {
    info: Sequelize.TEXT,
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: [
        ReservationType.GUEST,
        ReservationType.TENNIS_SCHOOL,
        ReservationType.USER,
        ReservationType.COMPETITOR,
        ReservationType.ELDER_GROUP,
        ReservationType.TOURNAMENT,
        ReservationType.SERVICE,
        ReservationType.SUBSCRIPTION
      ]
    },
    hour: { type: Sequelize.INTEGER, allowNull: false },
    date: { type: Sequelize.DATEONLY, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
  });

  Reservations.associate = function (models) {
    models.Reservations.belongsTo(models.Seasons, {
      as: 'season',
      foreignKey: {
        name: 'seasonId',
        allowNull: true
      }
    });

    models.Reservations.belongsTo(models.Courts, {
      as: 'court',
      foreignKey: {
        name: 'courtId',
        allowNull: false
      }
    });

    models.Reservations.hasMany(models.ReservationPayments, {
      as: 'payments',
      foreignKey: {
        name: 'reservationId',
        allowNull: false
      }
    });

    models.Reservations.belongsTo(models.Users, {
      as: 'administrator',
      foreignKey: {
        name: 'administratorId',
        allowNull: true
      }
    });

    models.Reservations.belongsTo(models.Users, {
      as: 'customer',
      foreignKey: {
        name: 'customerId',
        allowNull: true
      }
    });

    models.Reservations.belongsTo(models.Subscriptions, {
      as: 'subscription',
      foreignKey: {
        name: 'subscriptionId',
        allowNull: true
      }
    });
  }

  return Reservations;
}