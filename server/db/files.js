module.exports = (db, Sequelize) => {
  let Files = db.define("Files", {
    name: Sequelize.STRING,
    content: Sequelize.BLOB,
    mimeType: Sequelize.STRING
  });

  return Files;
}