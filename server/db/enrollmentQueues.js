module.exports = (db, Sequelize) => {
  const EnrollmentQueues = db.define("EnrollmentQueues", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
  });

  EnrollmentQueues.associate = (models) => {
    models.EnrollmentQueues.belongsTo(models.Users, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
        unique: 'EnrollmentQueuess_Scheme_Team_UQ'
      }
    });

    models.EnrollmentQueues.belongsTo(models.TournamentSchemes, {
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'EnrollmentQueuess_Scheme_Team_UQ'
      }
    });
  }

  return EnrollmentQueues;
}