module.exports = (db, Sequelize) => {
  return db.define("Rankings", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    points: Sequelize.INTEGER
  });
}