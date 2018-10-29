module.exports = (db, Sequelize) => {
  const Seasons = db.define("Seasons", {
    name: { type: Sequelize.STRING, allowNull: false },
    info: Sequelize.TEXT,
    seasonStart: { type: Sequelize.DATEONLY, allowNull: false },
    seasonEnd: { type: Sequelize.DATEONLY, allowNull: false },
    workingHoursStart: { type: Sequelize.INTEGER, allowNull: false },
    workingHoursEnd: { type: Sequelize.INTEGER, allowNull: false }
  });

  Seasons.associate = function (models) {
    models.Seasons.hasMany(models.Subscriptions, {
      as: 'subscriptions',
      foreignKey: {
        name: 'seasonId',
        allowNull: false
      }
    });
  }

  return Seasons;
}