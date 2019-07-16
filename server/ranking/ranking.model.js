module.exports = (db, Sequelize) => {
  const Rankings = db.define("Rankings", {
    points: Sequelize.INTEGER
  });

  Rankings.associate = function (models) {
    models.Rankings.belongsTo(models.Tournaments, {
      as: 'tournament',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });

    models.Rankings.belongsTo(models.Teams, {
      as: 'team',
      foreignKey: {
        name: 'teamId',
        allowNull: false
      }
    });
  }

  return Rankings;
}