module.exports = (db, Sequelize) => {
  return db.define("Sets", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    team1: { type: Sequelize.INTEGER, allowNull: false },
    team2: { type: Sequelize.INTEGER, allowNull: false },
    tiebreaker: { type: Sequelize.INTEGER, allowNull: true },
    order: { type: Sequelize.INTEGER, allowNull: false }
  })
}