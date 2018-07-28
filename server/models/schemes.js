const { TournamentSchemes } = require('../db');
const Enrollments = require('./enrollments');
const Enums = require('../enums');
const Teams = require('./teams');

TournamentSchemes.enroll = function (schemeId, team, trn = null) {
  return TournamentSchemes
    .findById(schemeId)
    .then(scheme => {
      let mpc = 0;
      if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        mpc = scheme.maxPlayerCount;
      else if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        mpc = scheme.groupCount * scheme.teamsPerGroup;

      return Enrollments.enroll(scheme.id, team.id, mpc, trn);
    });
}

module.exports = TournamentSchemes;