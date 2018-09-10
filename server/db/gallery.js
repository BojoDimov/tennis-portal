module.exports = (db, Sequelize) => {
  const Gallery = db.define('Gallery');

  Gallery.associate = function (models) {
    models.Gallery.belongsTo(models.Tournaments, {
      as: 'tournament',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });

    models.Gallery.belongsTo(models.Files, {
      foreignKey: {
        name: 'imageId',
        allowNull: false
      }
    });
  }

  return Gallery;
}