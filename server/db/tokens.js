module.exports = (db, Sequelize) => {
  return db.define('Tokens', {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    token: Sequelize.STRING(40),
    expires: Sequelize.DATE,
    issued: Sequelize.STRING
  });
}