const { Status } = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Tournaments = db.define('Tournaments', {
    name: { type: Sequelize.STRING, allowNull: false, },
    info: Sequelize.TEXT,
    status: {
      type: Sequelize.ENUM, allowNull: false,
      values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE]
    },
    thumbnailId: Sequelize.INTEGER,
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
  });

  return Tournaments;
}