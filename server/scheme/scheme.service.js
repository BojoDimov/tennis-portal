const {
  sequelize,
  Schemes,
  Matches,
  Groups,
  GroupTeams
} = require('../db');
const { SchemeType } = require('../infrastructure/enums');
const Enrollments = require('../enrollment/enrollment.service');
const Bracket = require('./bracketFunctions');

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

  async drawBracket(scheme) {
    const teams = await Enrollments.getPlayers(scheme);

    if (scheme.schemeType == SchemeType.ELIMINATION) {
      let matches = Bracket.drawEliminations(scheme, scheme.seed, teams)
      return await Matches.bulkCreate(matches);
    }
    else if (scheme.schemeType == SchemeType.GROUP) {
      let groups = Bracket.drawGroups(scheme, scheme.seed, teams);
      return Promise.all(groups.map(group => Groups.create(group, {
        include: [
          { model: GroupTeams, as: 'teams' }
        ]
      })));
    }
  }
}

module.exports = new SchemeService();