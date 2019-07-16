module.exports = (db, Sequelize) => {
  const Courts = db.define("Courts", {
    name: { type: Sequelize.STRING, allowNull: false },
    info: Sequelize.TEXT,
    workingHoursStart: { type: Sequelize.INTEGER, allowNull: false },
    workingHoursEnd: { type: Sequelize.INTEGER, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
  });
  return Courts;
}