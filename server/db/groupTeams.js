module.exports = (db, Sequelize) => {
  return db.define("GroupTeams", {
    order: { type: Sequelize.INTEGER, allowNull: false }
  });
}