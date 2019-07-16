module.exports = (db, Sequelize) => {
  const UserActivationCodes = db.define("UserActivationCodes", {
    token: { type: Sequelize.TEXT, allowNull: false },
    expires: { type: Sequelize.DATE, allowNull: false }
  });

  UserActivationCodes.associate = function (models) {
    models.UserActivationCodes.belongsTo(models.Users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  }
  return UserActivationCodes;
}