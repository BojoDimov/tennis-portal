module.exports = (db, Sequelize) => {
  const Seasons = db.define("Seasons", {
    name: { type: Sequelize.STRING, allowNull: false },
    info: Sequelize.TEXT,
    seasonStart: { type: Sequelize.DATEONLY, allowNull: false },
    seasonEnd: { type: Sequelize.DATEONLY, allowNull: false },
    workingHoursStart: { type: Sequelize.INTEGER, allowNull: false },
    workingHoursEnd: { type: Sequelize.INTEGER, allowNull: false }
  });
  return Seasons;
}