module.exports = (db, Sequelize) => {
  return db.define("GroupTeams", {
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false }
  });
}