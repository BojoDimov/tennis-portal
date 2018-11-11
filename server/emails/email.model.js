const { EmailType, EmailStatus } = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Emails = db.define('Emails', {
    to: { type: Sequelize.STRING, allowNull: false },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: [
        EmailType.REGISTRATION,
        EmailType.PASSWORD_RECOVERY,
        EmailType.RESERVATION_CANCELED
      ]
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: [
        EmailStatus.UNSENT,
        EmailStatus.PENDING,
        EmailStatus.SENT,
        EmailStatus.FAILED
      ]
    },
    subject: { type: Sequelize.STRING, allowNull: false },
    body: { type: Sequelize.TEXT, allowNull: false }
  });

  return Emails;
}