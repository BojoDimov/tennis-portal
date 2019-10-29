module.exports = (db, Sequelize) => {
  const EnrollmentQueues = db.define("EnrollmentQueues", {
    isPaid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  });

  EnrollmentQueues.associate = (models) => {
    models.EnrollmentQueues.belongsTo(models.Teams, {
      foreignKey: {
        name: 'teamId',
        allowNull: false,
        unique: 'EnrollmentQueues_Scheme_Team_UQ'
      }
    });

    models.EnrollmentQueues.belongsTo(models.TournamentSchemes, {
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'EnrollmentQueues_Scheme_Team_UQ'
      }
    });
  }

  return EnrollmentQueues;
}