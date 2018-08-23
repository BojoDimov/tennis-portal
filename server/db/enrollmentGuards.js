module.exports = (db, Sequelize) => {
  const EnrollmentGuards = db.define("EnrollmentGuards", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    schemeId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
      indexes: [
        {
          unique: true,
          fields: ['schemeId', 'userId']
        }
      ]
    });

  return EnrollmentGuards;
}