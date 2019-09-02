module.exports = (db, Sequelize) => {
  const Teams = db.define("Teams", {
    wonMatches: { type: Sequelize.INTEGER, default: 0 },
    totalMatches: { type: Sequelize.INTEGER, default: 0 },
    wonTournaments: { type: Sequelize.INTEGER, default: 0 },
    totalTournaments: { type: Sequelize.INTEGER, default: 0 },
    rankingCoefficient: { type: Sequelize.REAL, default: 0 },
    globalRank: { type: Sequelize.INTEGER, default: -1 }
  });

  Teams.associate = function (models) {
    models.Teams.belongsTo(models.Users, {
      as: 'user1',
      foreignKey: {
        name: 'user1Id',
        allowNull: false,
        unique: 'Teams_Users_UQ'
      }
    });

    models.Teams.belongsTo(models.Users, {
      as: 'user2',
      foreignKey: {
        name: 'user2Id',
        allowNull: true,
        unique: 'Teams_Users_UQ'
      }
    });

    models.Teams.hasMany(models.Rankings, {
      as: 'rankings',
      foreignKey: {
        name: 'teamId',
        allowNull: false
      }
    });

    models.Teams.hasMany(models.GroupTeams, {
      as: 'groupTeams',
      foreignKey: {
        name: 'teamId',
        allowNull: false
      }
    });
  }

  return Teams;
}