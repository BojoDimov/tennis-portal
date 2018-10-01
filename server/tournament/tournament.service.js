const { Tournaments, sequelize } = require('../db');

class TournamentsService {
  getAll() {
    return Tournaments
      .findAll({
        include: [{ all: true }]
      });
  }

  get(id) {
    return Tournaments
      .findById(id, {
        include: [{ all: true }]
      });
  }
}

module.exports = new TournamentsService();