module.exports = (db, Sequelize) => {
  return db.define('TournamentEditions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    info: Sequelize.TEXT,
    startDate: Sequelize.DATEONLY,
    endDate: Sequelize.DATEONLY,
    status: {
      type: Sequelize.ENUM,
      values: ['draft', 'published', 'inactive'],
      allowNull: false
    }
  }, {
      validate: {
        startDateEndDate() {
          if (this.startDate > this.endDate)
            throw new Error("Start date cannot be after end date");
        }
      }
    });
}