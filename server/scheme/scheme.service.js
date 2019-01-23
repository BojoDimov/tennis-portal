const {
  sequelize,
  Schemes,
  Matches,
  Groups,
  GroupTeams
} = require('../db');
const { BracketStatus } = require('../infrastructure/enums');
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
    if (model.hasGroupPhase)
      model.maxPlayerCount = model.groupCount * model.teamsPerGroup;
  }

  async drawBracket(scheme) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const teams = await Enrollments.getPlayers(scheme);

      if (scheme.bracketStatus == BracketStatus.UNDRAWN && scheme.hasGroupPhase) {
        //draw group phase
        for (const group of Bracket.drawGroups(scheme, scheme.seed, teams)) {
          await Groups.create(group, {
            include: [{ model: GroupTeams, as: 'teams' }],
            transaction
          });
        }
      }
      else if (scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase) {
        //draw elimination phase
        scheme.bracketStatus = BracketStatus.ELIMINATION_DRAWN;
        await scheme.save();
        let matches = Bracket.drawEliminations(scheme, scheme.seed, teams);
        await Matches.bulkCreate(matches, { transaction });
      }
      else if (scheme.bracketStatus == BracketStatus.GROUPS_END) {
        //draw elimination from groups
      }
      else {
        throw { name: 'DomainActionError', error: 'invalidState' };
      }

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new SchemeService();