const {
  sequelize,
  Schemes
} = require('../db');
const { SchemeType } = require('../infrastructure/enums');

class SchemeService {
  async filter() {

  }

  async get(id) {
    return await Schemes.findById(id, {
      include: [
        'edition'
      ]
    });
  }

  async create(model) {
    this.formatModel(model);
    this.validateModel(model);
    this.processModel(model);

    return await Schemes.create(model);
  }

  async update(scheme, model) {
    this.formatModel(model);
    this.validateModel(model);
    this.processModel(model);

    return await scheme.update(model);
  }

  async remove(id) {

  }

  formatModel(model) {
    model.ageFrom = parseInt(model.ageFrom) || null;
    model.ageTo = parseInt(model.ageFrom) || null;
    model.maxPlayerCount = parseInt(model.maxPlayerCount) || null;
    model.groupCount = parseInt(model.groupCount) || null;
    model.teamsPerGroup = parseInt(model.teamsPerGroup) || null;
    model.seed = parseInt(model.seed) || null;
  }

  validateModel(model) {

  }

  processModel(model) {
    if (model.schemeType == SchemeType.GROUP)
      model.maxPlayerCount = model.groupCount * model.teamsPerGroup;
  }
}

module.exports = new SchemeService();