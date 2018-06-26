module.exports = (db, Sequelize) => {
  return db.define("Matches", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    match: Sequelize.INTEGER,
    round: Sequelize.INTEGER,
    seed1: { type: Sequelize.INTEGER, allowNull: true },
    seed2: { type: Sequelize.INTEGER, allowNull: true },
    withdraw: { type: Sequelize.INTEGER, allowNull: true }
  });
}