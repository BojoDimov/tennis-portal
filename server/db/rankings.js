module.exports = (db, Sequelize) => {
  const Rankings = db.define("Rankings", {
    points: Sequelize.INTEGER
  });

  Rankings.associate = (models) => {
    models.Rankings.belongsTo(models.Teams, {
      foreignKey: {
        name: 'teamId',
        allowNull: false
      }
    });

    models.Rankings.belongsTo(models.Tournaments, {
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    });
  }

  return Rankings;
}