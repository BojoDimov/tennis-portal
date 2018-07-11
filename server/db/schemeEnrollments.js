module.exports = (db, Sequelize) => {
  const SchemeEnrollments = db.define("SchemeEnrollments");

  SchemeEnrollments.associate = (models) => {
    models.SchemeEnrollments.belongsTo(models.Teams, {
      foreignKey: {
        name: 'teamId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });

    models.SchemeEnrollments.belongsTo(models.TournamentSchemes, {
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });
  }

  return SchemeEnrollments;
}