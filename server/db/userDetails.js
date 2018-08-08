module.exports = (db, Sequelize) => {
  const UserDetails = db.define('UserDetails', {

  });
  UserDetails.associate = function (models) {
    models.UserDetails.belongsTo(models.Users, {
      as: 'details',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  }

  return UserDetails;
}