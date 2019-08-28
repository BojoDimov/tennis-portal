const { Tournaments, Rankings, Teams, Users } = require('../db');
const Op = require('../db').Sequelize.Op;
const { Status } = require('../infrastructure/enums');

class TournamentsService {
  async filter(includeDraft) {
    let options = {
      order: [
        ['id', 'desc']
      ]
    };

    if (!includeDraft)
      options.where = {
        [Op.not]: {
          status: Status.DRAFT
        }
      };

    return await Tournaments.findAll(options);
  }

  async get(id, includeDraft) {
    const options = {
      where: { id },
      include: [
        {
          model: Rankings, as: 'rankings',
          include: [{
            model: Teams, as: 'team',
            include: [
              { model: Users, as: 'user1', attributes: ['id', 'name'] },
              { model: Users, as: 'user2', attributes: ['id', 'name'] }
            ]
          }],
          order: [
            ['points', 'desc']
          ]
        }
      ]
    };

    if (!includeDraft)
      options.where[Op.not] = {
        status: Status.DRAFT
      };

    const tournament = await Tournaments.findOne(options);
    if (!tournament)
      throw { name: 'NotFound' };
    return tournament;
  }

  async create(model) {
    model.status = Status.DRAFT;
    return await Tournaments.create(model);
  }

  async update(id, model) {
    const tournament = await this.get(id, true);
    return await tournament.update(model);
  }

  async remove(id) {
    const tournament = await this.get(id, true);
    return await tournament.destroy();
  }
}

module.exports = new TournamentsService();