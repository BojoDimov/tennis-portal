const { TournamentSchemes, EnrollmentGuards, Payments } = require('../db');
const Enrollments = require('./enrollments');
const { SchemeType, PaymentStatus, TournamentTaxes } = require('../enums');
const Teams = require('./teams');

TournamentSchemes.enroll = function (schemeId, team, trn) {
  return TournamentSchemes
    .findById(schemeId)
    .then(scheme => {
      let mpc = 0;
      if (scheme.schemeType == SchemeType.ELIMINATION)
        mpc = scheme.maxPlayerCount;
      else if (scheme.schemeType == SchemeType.GROUP)
        mpc = scheme.groupCount * scheme.teamsPerGroup;

      const payment = {
        amount: scheme.singleTeams ? TournamentTaxes.SINGLE : TournamentTaxes.DOUBLE,
        status: PaymentStatus.UNPAID,
        user1Id: team.user1Id,
        user2Id: team.user2Id,
        schemeId: schemeId
      };

      return Payments
        .create(payment, { transaction: trn })
        .then(() => Enrollments.enrollGuard(schemeId, team, trn))
        .then(() => Enrollments.enroll(scheme.id, team.id, mpc, scheme.registrationEnd, trn));
    });
}

function validateCanEnroll(scheme, team) {

}

module.exports = TournamentSchemes;