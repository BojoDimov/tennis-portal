module.exports = (db, Sequelize) => {
  const GroupTeams = db.define("GroupTeams", {
    //order starts from 1. Why? Because reasons, of course.
    order: { type: Sequelize.INTEGER, allowNull: false }
  });

  GroupTeams.associate = (models) => {
    models.GroupTeams.belongsTo(models.Teams, {
      as: 'team',
      foreignKey: {
        name: 'teamId',
        allowNull: true
      }
    });

    models.GroupTeams.belongsTo(models.Groups, {
      as: 'group',
      foreignKey: {
        name: 'groupId',
        allowNull: true
      }
    });
  }

  return GroupTeams;
}