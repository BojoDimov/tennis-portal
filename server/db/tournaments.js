module.exports = (db, Sequelize) => {
  return db.define('Tournaments', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    info: Sequelize.TEXT,
    status: {
      type: Sequelize.ENUM,
      values: ['draft', 'published', 'inactive'],
      allowNull: false
    }
  });
}