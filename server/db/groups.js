module.exports = (db, Sequelize) => {
  return db.define("Groups", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    group: { type: Sequelize.INTEGER, allowNull: false }
  })
}