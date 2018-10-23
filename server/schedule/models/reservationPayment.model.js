const { ReservationPayment } = require('../../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const ReservationPayments = db.define("ReservationPayments", {
    type: {
      type: Sequelize.ENUM, allowNull: false,
      values: [
        ReservationPayment.SODEXO,
        ReservationPayment.MULTISPORT,
        ReservationPayment.CASH,
        ReservationPayment.COMPETITOR
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
  }

  return ReservationPayments;
}