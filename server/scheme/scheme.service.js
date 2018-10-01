const {
  sequelize,
  Schemes
} = require('../db');
const { SchemeType } = require('../infrastructure/enums');

class SchemeService {
  getAll(options) {
    return Schemes
      .findAll({
        where: {
          schemeType: SchemeType.ELIMINATION
        },
        include: ['groupPhase', 'edition']
      });
  }

  get(id) {
    return Schemes
      .findById(id, {
        include: [
          'groupPhase',
          'edition'
        ]
      });
  }
}

module.exports = new SchemeService();