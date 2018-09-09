const {
  TournamentSchemes,
  TournamentEditions,
  Tournaments,
  Teams,
  Users,
  SmtpCredentials,
  Enrollments
} = require('../models');
const db = require('../db');
const Op = db.Sequelize.Op;
const { EmailType } = require('../enums');
const { sendEmail } = require('../emailService');

function getScheme(id) {
  return TournamentSchemes
    .findById(id, {
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }]
        },
        { model: TournamentSchemes, as: 'groupPhase' }
      ]
    });
}

function notifyTeam(schemeId, teamId, emailType) {
  return Promise
    .all([
      getScheme(schemeId),
      Teams.findById(teamId, {
        include: [{ model: Users, as: 'user1' }, { model: Users, as: 'user2' }]
      })
    ])
    .then(([scheme, team]) => sendEmail(emailType, {
      tournamentName: scheme.TournamentEdition.Tournament.name,
      editionName: scheme.TournamentEdition.name,
      schemeName: scheme.name,
      users: [team.user1.name].concat((team.user2 ? [team.user2.name] : []))
    },
      [team.user1.email].concat((team.user2 ? [team.user2.email] : []))
    ));
}

function cancelUserEnrollment(schemeId, userId) {
  let sp = TournamentSchemes.findById(schemeId);
  let tp = Teams.findAll({
    where: {
      [Op.or]: {
        user1Id: userId,
        user2Id: userId
      }
    }
  });

  return db.sequelize
    .transaction(function (trn) {
      return Promise
        .all([sp, tp])
        .then(([scheme, teams]) => Enrollments.cancelEnroll(schemeId, teams.map(t => t.id), trn))
    })
    .then(teamId => {
      return notifyTeam(schemeId, teamId, EmailType.UNREGISTER);
    });
}


module.exports = {
  notifyTeam, getScheme, cancelUserEnrollment
};