module.exports = (db, Sequelize) => {
  return db.define("EnrollmentsQueues", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
  });
}