module.exports = (db, Sequelize) => {
  const SmtpCredentials = db.define("SmtpCredentials", {
    service: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    passwordHash: { type: Sequelize.TEXT, allowNull: false }
  });

  return SmtpCredentials;
}