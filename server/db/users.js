const { Gender } = require('../enums');

module.exports = (db, Sequelize) => {
  const Users = db.define('Users', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      unique: true
    },
    passwordHash: { type: Sequelize.STRING(40), allowNull: false },
    passwordSalt: { type: Sequelize.STRING(16), allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    birthDate: { type: Sequelize.DATEONLY, allowNull: false },
    telephone: { type: Sequelize.STRING, allowNull: false },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isSystemAdministrator: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
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
  }

  return Users;
}