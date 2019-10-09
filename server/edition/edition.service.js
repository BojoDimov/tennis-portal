const { Tournaments, Editions, Schemes, sequelize, Matches } = require('../db');
const Op = sequelize.Op;
const moment = require('moment-timezone');
const { Status } = require('../infrastructure/enums');
const MatchService = require('../match/match.service');

class EditionsService {
  async filter(includeDraft) {
    let options = {
      where: {},
      include: [
        {
          model: Tournaments,
          as: 'tournament'
        },
        {
          model: Schemes,
          as: 'schemes',
          include: [
            { model: Matches, as: 'final', include: MatchService.matchesIncludes() }
          ]
        }
      ],
      order: [['startDate', 'desc']]
    };

    if (!includeDraft) {
      options.where[Op.not] = {
        status: Status.DRAFT
      };
      options.include = [
        {
          model: Tournaments,
          as: 'tournament'
        },
        {
          model: Schemes,
          as: 'schemes',
          where: {
            [Op.not]: {
              status: Status.DRAFT
            }
          },
          include: [
            { model: Matches, as: 'final', include: MatchService.matchesIncludes() }
          ]
        }
      ]
    }

    return await Editions.findAll(options);
  }

  async get(id, includeDraft) {
    let options = {
      where: {
        id
      },
      include: [
        {
          model: Tournaments,
          as: 'tournament'
        },
        {
          model: Schemes,
          as: 'schemes',
          where: includeDraft ? {} : {
            status: Status.PUBLISHED
          },
          required: false
        }
      ]
    };

    if (!includeDraft)
      options.where[Op.not] = {
        status: Status.DRAFT
      };

    const edition = await Editions.findOne(options);
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
    const edition = await this.get(id, true);
    model.startDate = moment(model.startDate).format('YYYY-MM-DD');
    model.endDate = moment(model.endDate).format('YYYY-MM-DD');
    return await edition.update(model);
  }

  async remove(id) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const edition = await this.get(id, true);
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