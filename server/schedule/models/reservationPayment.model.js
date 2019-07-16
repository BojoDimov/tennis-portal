const { ReservationPayment } = require('../../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const ReservationPayments = db.define("ReservationPayments", {
    type: {
      type: Sequelize.ENUM, allowNull: false,
      values: [
        ReservationPayment.SODEXO,
        ReservationPayment.MULTISPORT,
        ReservationPayment.ABK,
        ReservationPayment.CASH,
        ReservationPayment.SUBS_ZONE_1,
        ReservationPayment.SUBS_ZONE_2
      ]
    },
    amount: { type: Sequelize.DECIMAL(10, 2), allowNull: true }
  });

  ReservationPayments.associate = function (models) {
    models.ReservationPayments.belongsTo(models.Reservations, {
      as: 'reservation',
      foreignKey: {
        name: 'reservationId',
        allowNull: false
      }
    });

    models.ReservationPayments.belongsTo(models.Subscriptions, {
      as: 'subscription',
      foreignKey: {
        name: 'subscriptionId',
        allowNull: true
      }
    });
  }

  return ReservationPayments;
}