module.exports = (db, Sequelize) => {
  const Tokens = db.define('Tokens', {
    token: Sequelize.STRING(40),
    expires: Sequelize.DATE,
    issued: Sequelize.STRING
  });

  Tokens.associate = function (models) {
    models.Tokens.belongsTo(models.Users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  }

  return Tokens;
}