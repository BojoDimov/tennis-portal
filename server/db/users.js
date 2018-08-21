const { Gender } = require('../enums');

module.exports = (db, Sequelize) => {
  const Users = db.define('Users', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      unique: true
    },
    passwordHash: { type: Sequelize.STRING(40), allowNull: false },
    passwordSalt: { type: Sequelize.STRING(16), allowNull: false },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^[А-я, ]+$/
      }
    },
    birthDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isAfter: "1850-01-01"
      }
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9,+,(,)]+$/
      }
    },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isSystemAdministrator: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: [Gender.MALE, Gender.FEMALE]
    }
  });

  Users.associate = (models) => {
    models.Users.hasOne(models.Tokens, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });

    models.Users.hasOne(models.SmtpCredentials, {
      as: 'smtp',
      foreignKey: {
        name: 'userId',
        allowNull: true
      }
    });

    models.Users.hasOne(models.UserDetails, {
      as: 'details',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  }

  return Users;
}