const {
  Gender,
  PlayStyle,
  CourtType,
  BackhandType,
  ReservationType
} = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Users = db.define('Users', {

    //account properties
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    passwordHash: { type: Sequelize.STRING(40), allowNull: false },
    passwordSalt: { type: Sequelize.STRING(16), allowNull: false },

    //user required information
    name: { type: Sequelize.STRING, allowNull: false },
    birthDate: { type: Sequelize.DATEONLY, allowNull: true },
    telephone: { type: Sequelize.STRING, allowNull: false },
    gender: {
      type: Sequelize.ENUM, allowNull: true,
      values: [Gender.MALE, Gender.FEMALE]
    },

    //user optional information
    startedPlaying: Sequelize.INTEGER,
    playStyle: {
      type: Sequelize.ENUM,
      values: [PlayStyle.LEFT, PlayStyle.RIGHT]
    },
    backhandType: {
      type: Sequelize.ENUM,
      values: [BackhandType.ONE, BackhandType.TWO]
    },
    courtType: {
      type: Sequelize.ENUM,
      values: [CourtType.CLAY, CourtType.GRASS, CourtType.HARD, CourtType.INDOOR]
    },

    //debts information
    subscriptionDebt: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    reservationDebt: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },

    //system properties
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isSuperAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isTrainer: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isTournamentAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  });


  Users.associate = function (models) {
    models.Users.hasMany(models.Subscriptions, {
      as: 'subscriptions',
      foreignKey: {
        name: 'customerId',
        allowNull: false
      }
    });

    models.Users.hasOne(models.Teams, {
      as: 'team',
      foreignKey: {
        name: 'user1Id',
        allowNull: false
      }
    });
  }

  return Users;
}