module.exports = (db, Sequelize) => {
  return db.define('Logs', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip: Sequelize.STRING,
    path: Sequelize.STRING,
    method: Sequelize.STRING,
    body: Sequelize.TEXT,
    params: Sequelize.TEXT,
    query: Sequelize.TEXT,
    error: Sequelize.TEXT
  });
}