module.exports = (db, Sequelize) => {
  const GroupTeams = db.define("GroupTeams", {
    order: { type: Sequelize.INTEGER, allowNull: false }
  });

  GroupTeams.associate = (models) => {
    models.GroupTeams.belongsTo(models.Teams, {
      foreignKey: {
        name: 'teamId',
        allowNull: true
      }
    });

    models.GroupTeams.belongsTo(models.Groups, {
      foreignKey: {
        name: 'groupId',
        allowNull: true
      }
    });
  }

  return GroupTeams;
}