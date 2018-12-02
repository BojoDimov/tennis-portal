const { Tournaments } = require('../db');
const { Status } = require('../infrastructure/enums');
class TournamentsService {
  async filter() {
    return await Tournaments.findAll();
  }

  async get(id) {
    const tournament = await Tournaments.findById(id);
    if (!tournament)
      throw { name: 'NotFound' };
    return tournament;
  }

  async create(model) {
    model.status = Status.DRAFT;
    return await Tournaments.create(model);
  }

  async update(id, model) {
    const tournament = this.get(id);
    return await tournament.update(model);
  }

  async remove(id) {
    const tournament = this.get(id);
    return await tournament.destroy();
  }
}

module.exports = new TournamentsService();