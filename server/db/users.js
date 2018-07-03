module.exports = (db, Sequelize) => {
  const Users = db.define('Users', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
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
    fullname: { type: Sequelize.STRING, allowNull: false },
    birthDate: { type: Sequelize.DATEONLY, allowNull: false },
    telephone: { type: Sequelize.STRING, allowNull: false },
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['male', 'female']
    }
  });

  Users.associate = (models) => {
    models.Users.hasOne(models.Tokens, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });

    models.Users.hasMany(models.Rankings, {
      as: 'ranking',
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    });
  }

  return Users;
}