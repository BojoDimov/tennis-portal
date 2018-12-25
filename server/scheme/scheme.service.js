const {
  sequelize,
  Schemes
} = require('../db');
const { SchemeType } = require('../infrastructure/enums');

class SchemeService {
  async filter() {

  }

  async get(id) {

  }

  async create(model) {
    this.formatModel(model);
    return await Schemes.create(model);
  }

  formatModel(model) {
    model.maxPlayerCount = parseInt(model.maxPlayerCount);
    model.date = new Date('2018-12-20')
    model.registrationStart = new Date('2018-12-15');
    model.registrationEnd = new Date('2018-12-17');
    model.ageFrom = model.ageFrom ? model.ageFrom : null;
    model.ageTo = model.ageTo ? model.ageTo : null;
    model.groupCount = model.groupCount || null;
    model.teamsPerGroup = model.teamsPerGroup || null;
  }

  async update(id, model) {

  }

  async remove(id) {

  }
}

module.exports = new SchemeService();