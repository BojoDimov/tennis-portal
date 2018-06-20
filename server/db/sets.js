module.exports = (db, Sequelize) => {
  return db.define("Sets", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    t1Score: { type: Sequelize.INTEGER, allowNull: false },
    t2Score: { type: Sequelize.INTEGER, allowNull: false },
    tiebreaker: { type: Sequelize.INTEGER, allowNull: true },
    setNumber: { type: Sequelize.INTEGER, allowNull: false }
  })
}