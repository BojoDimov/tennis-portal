const { PaymentStatus } = require('../enums');

module.exports = (db, Sequelize) => {
  const Payments = db.define('Payments', {
    amount: { type: Sequelize.INTEGER, allowNull: false },
    status: {
      type: Sequelize.ENUM,
      values: [PaymentStatus.UNPAID, PaymentStatus.PENDING, PaymentStatus.PAID],
      allowNull: false
    }
  });

  Payments.associate = function (models) {
    models.Payments.belongsTo(models.Users, {
      as: 'user1',
      foreignKey: {
        name: 'user1Id',
        allowNull: false,
        unique: 'UQ_PAYMENTS_TEAM_SCHEME'
      }
    });

    models.Payments.belongsTo(models.Users, {
      as: 'user2',
      foreignKey: {
        name: 'user2Id',
        allowNull: true,
        unique: 'UQ_PAYMENTS_TEAM_SCHEME'
      }
    });

    models.Payments.belongsTo(models.TournamentSchemes, {
      as: 'scheme',
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'UQ_PAYMENTS_TEAM_SCHEME'
      }
    });

    models.Payments.belongsTo(models.Users, {
      as: 'paidBy',
      foreignKey: {
        name: 'paidById',
        allowNull: true
      }
    });
  }

  return Payments;
}