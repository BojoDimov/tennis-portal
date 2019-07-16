module.exports = (db, Sequelize) => {
  const Enrollments = db.define("Enrollments");

  Enrollments.associate = (models) => {
    models.Enrollments.belongsTo(models.Teams, {
      as: 'team',
      foreignKey: {
        name: 'teamId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });

    models.Enrollments.belongsTo(models.Schemes, {
      as: 'scheme',
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });
  }

  return Enrollments;
}