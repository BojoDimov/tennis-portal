module.exports = (db, Sequelize) => {
  const Rankings = db.define("Rankings", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    points: Sequelize.INTEGER
  });

  Rankings.associate = (models) => {
    models.Rankings.belongsTo(models.Users, {
      foreignKey: {
        name: 'userId',
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