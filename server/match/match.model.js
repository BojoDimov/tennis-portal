module.exports = (db, Sequelize) => {
  const Matches = db.define("Matches", {
    match: Sequelize.INTEGER,
    round: Sequelize.INTEGER,
    seed1: { type: Sequelize.INTEGER, allowNull: true },
    seed2: { type: Sequelize.INTEGER, allowNull: true },
    withdraw: { type: Sequelize.INTEGER, allowNull: true }
  });

  Matches.associate = (models) => {
    models.Matches.belongsTo(models.Teams, {
      as: 'team1',
      foreignKey: {
        name: 'team1Id',
        allowNull: true
      }
    });

    models.Matches.belongsTo(models.Teams, {
      as: 'team2',
      foreignKey: {
        name: 'team2Id',
        allowNull: true
      }
    });

    models.Matches.belongsTo(models.Teams, {
      as: 'winner',
      foreignKey: {
        name: 'winnerId',
        allowNull: true
      }
    });

    models.Matches.belongsTo(models.Schemes, {
      as: 'scheme',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });

    models.Matches.hasMany(models.Sets, {
      as: 'sets',
      foreignKey: {
        name: 'matchId',
        allowNull: false
      }
    });

    models.Matches.belongsTo(models.Groups, {
      as: 'group',
      foreignKey: {
        name: 'groupId',
        allowNull: true
      }
    });
  }

  return Matches;
}