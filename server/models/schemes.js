const { TournamentSchemes, EnrollmentGuards } = require('../db');
const Enrollments = require('./enrollments');
const Enums = require('../enums');
const Teams = require('./teams');

TournamentSchemes.enroll = function (schemeId, team, trn) {
  return TournamentSchemes
    .findById(schemeId)
    .then(scheme => {
      let mpc = 0;
      if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        mpc = scheme.maxPlayerCount;
      else if (scheme.schemeType == Enums.SchemeType.GROUP)
        mpc = scheme.groupCount * scheme.teamsPerGroup;

      return Enrollments
        .enrollGuard(schemeId, team, trn)
        .then(() => Enrollments
          .enroll(scheme.id, team.id, mpc, scheme.registrationEnd, trn))
    });
}

function validateCanEnroll(scheme, team) {

}

module.exports = TournamentSchemes;