const { Editions, sequelize } = require('../db');

class EditionsService {
  async filter() {
    return await Editions.findAll({
      include: ['tournament', 'schemes'],
      order: [['date', 'desc']]
    });
  }

  async get(id) {
    const edition = await Editions.findById(id, {
      include: ['tournament', 'schemes']
    });
    if (!edition)
      throw { name: 'NotFound' };
    return edition;
  }

  async create(model) {
    return await Editions.create(model);
  }

  async update(id, model) {
    const edition = this.get(id);
    return await edition.update(model);
  }

  async remove(id) {
    const edition = this.get(id);
    return await edition.destroy();
  }
}

module.exports = new EditionsService();