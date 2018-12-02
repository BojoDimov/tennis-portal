const { Editions, sequelize } = require('../db');
const moment = require('moment-timezone');

class EditionsService {
  async filter() {
    return await Editions.findAll({
      include: ['tournament', 'schemes'],
      order: [['id', 'desc']]
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
    model.startDate = moment(model.startDate).format('YYYY-MM-DD');
    model.endDate = moment(model.endDate).format('YYYY-MM-DD');
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