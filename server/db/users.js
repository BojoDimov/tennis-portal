module.exports = (db, Sequelize) => {
  return db.define('Users', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    passwordHash: { type: Sequelize.STRING(40), allowNull: false },
    passwordSalt: { type: Sequelize.STRING(16), allowNull: false },
    fullname: { type: Sequelize.STRING, allowNull: false },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    telephone: Sequelize.STRING,
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['male', 'female']
    }
  })
}