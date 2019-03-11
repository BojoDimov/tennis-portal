const { Tournaments, Editions, Schemes, sequelize } = require('../db');
const Op = sequelize.Op;
const moment = require('moment-timezone');
const { Status } = require('../infrastructure/enums');

class EditionsService {
  async filter(isAdmin) {
    return await Editions.findAll({
      where: isAdmin ? {} : {
        status: Status.PUBLISHED
      },
      include: [
        {
          model: Tournaments,
          as: 'tournament',
          include: ['thumbnail']
        }
      ],
      order: [['id', 'desc']]
    });
  }

  async get(id) {
    const edition = await Editions.findById(id, {
      include: [
        {
          model: Tournaments,
          as: 'tournament',
          include: ['thumbnail']
        },
        'schemes'
      ]
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
    const edition = await this.get(id);
    model.startDate = moment(model.startDate).format('YYYY-MM-DD');
    model.endDate = moment(model.endDate).format('YYYY-MM-DD');
    return await edition.update(model);
  }

  async remove(id) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const edition = await this.get(id);
      if (!edition)
        throw { name: 'NotFound' };

      await Schemes.destroy({ where: { id: edition.schemes.map(e => e.id) }, transaction });
      await Editions.destroy({ where: { id: edition.id }, transaction });
      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new EditionsService();