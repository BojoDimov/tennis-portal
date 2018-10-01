const { Editions, sequelize } = require('../db');

class EditionsService {
  getAll() {
    return Editions
      .findAll({
        where: {
          isActive: true
        },
        include: [{ all: true }]
      });
  }

  get(id) {
    return Editions
      .findById(id, {
        include: [{ all: true }]
      });
  }

  remove(id) {
    return this
      .get(id)
      .then(edition => edition.update({ isActive: false }));
  }
}

module.exports = new EditionsService();