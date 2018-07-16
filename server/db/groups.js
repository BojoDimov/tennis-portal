module.exports = (db, Sequelize) => {
  const Groups = db.define("Groups", {
    group: { type: Sequelize.INTEGER, allowNull: false }
  });

  Groups.associate = (models) => {
    models.Groups.hasMany(models.GroupTeams, {
      as: 'teams',
      foreignKey: {
        name: 'groupId',
        allowNull: true
      }
    });

    models.Groups.hasMany(models.Matches, {
      as: 'matches',
      foreignKey: {
        name: 'groupId',
        allowNull: true
      }
    });

    models.Groups.belongsTo(models.TournamentSchemes, {
      foreignKey: {
        name: 'schemeId',
        allowNull: true
      }
    });
  }

  return Groups;
}