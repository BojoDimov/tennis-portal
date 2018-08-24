module.exports = (db, Sequelize) => {
  const SchemeEnrollments = db.define("SchemeEnrollments", {
    isPaid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  });

  SchemeEnrollments.associate = (models) => {
    models.SchemeEnrollments.belongsTo(models.Teams, {
      as: 'team',
      foreignKey: {
        name: 'teamId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });

    models.SchemeEnrollments.belongsTo(models.TournamentSchemes, {
      as: 'scheme',
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'Enrollments_Scheme_Team_UQ'
      }
    });
  }

  return SchemeEnrollments;
}