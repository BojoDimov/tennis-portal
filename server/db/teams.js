const { Gender } = require('../enums');

module.exports = (db, Sequelize) => {
  const Teams = db.define("Teams");

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
      as: 'ranking',
      foreignKey: {
        name: 'teamId',
        allowNull: false
      }
    });

    models.Teams.getAggregateRoot = function () {
      return [
        { model: models.Users, as: 'user1', attributes: ['id', 'name', 'gender', 'birthDate'] },
        { model: models.Users, as: 'user2', attributes: ['id', 'name', 'gender', 'birthDate'] }
      ];
    }
  }

  return Teams;
}