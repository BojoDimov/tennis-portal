const { CourtType, BackhandType, PlayStyle } = require('../enums');

module.exports = (db, Sequelize) => {
  const UserDetails = db.define('UserDetails', {
    courtType: {
      type: Sequelize.ENUM, allowNull: true,
      values: [CourtType.CLAY, CourtType.GRASS, CourtType.HARD, CourtType.INDOOR]
    },
    backhand: {
      type: Sequelize.ENUM, allowNull: true,
      values: [BackhandType.ONE, BackhandType.TWO]
    },
    playStyle: {
      type: Sequelize.ENUM, allowNull: true,
      values: [PlayStyle.LEFT, PlayStyle.RIGHT]
    },
    startedPlaying: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {
        min: 1900,
        max: (new Date()).getFullYear()
      }
    }
  });

  UserDetails.associate = function (models) {
    models.UserDetails.belongsTo(models.Users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });

    models.UserDetails.belongsTo(models.Files, {
      as: 'profilePicture',
      foreignKey: {
        name: 'profilePictureId',
        allowNull: true
      }
    });
  }

  return UserDetails;
}