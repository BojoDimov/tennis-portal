module.exports = (db, Sequelize) => {
  return db.define("SchemeEnrollments", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
  });
}