const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes,
  Enrollments, Groups, Matches, Draws, Teams, Users, SmtpCredentials, Sets
} = require('../models');
const db = require('../db');
const Op = db.Sequelize.Op;
const { EmailType } = require('../enums');
const { sendEmail } = require('../emailService');
const auth = require('../middlewares/auth');
const Enums = require('../enums');

const find = (req, res) => {
  return TournamentSchemes
    .findAll({
      where: req.query
    })
    .then(schemes => res.json(schemes));
};

function _get(id) {
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

const get = (req, res) => {
  return _get(req.params.id).then(e => res.json(e));
};

const getWinner = (req, res, next) => {
  if (req.scheme.status != Enums.Status.FINALIZED)
    next({ name: 'DomainActionError', message: 'Invalid action: get winner' }, req, res, null);

  return Matches
    .findAll({
      where: {
        schemeId: req.params.id
      },
      include: [
        { model: Sets, as: 'sets' }
      ],
      order: [['round', 'desc'], ['match', 'desc']]
    })
    .then(matches => {
      if (matches[0].team1Id != null)
        return matches[0].team1Id;
      else return matches[0].team2Id;
    })
    .then(teamId => Teams.findById(teamId, { include: Teams.getAggregateRoot() }))
    .then(e => res.json(e));
}

const collect = (req, res) => {
  const userId = req.query.userId;

  //todo: make this work and remove check from frontend
  // let team = userId ? Teams.findOne({
  //   where: {
  //     user1Id: userId
  //   }
  // }) : Promise.resolve(null);
  let team = Promise.resolve(null);

  let scheme = TournamentSchemes
    .findById(req.params.id, {
      include: [
        { model: TournamentEditions },
        { model: TournamentSchemes, as: 'groupPhase' }
      ]
    });

  return Promise
    .all([team, scheme])
    .then(([team, scheme]) => Promise
      .all([
        Promise.resolve(team),
        Promise.resolve(scheme),
        Enrollments.get(scheme.id),
        Enrollments.getQueue(scheme.id),
        Draws.get(scheme)
      ])
    )
    .then(([team, scheme, enrollments, queue, draw]) => {
      return res.json({
        team, scheme, enrollments, queue, draw
      })
    });
}

const create = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';

  return TournamentSchemes.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const edit = (req, res, next) => {
  return TournamentSchemes
    .findById(req.body.id)
    .then(oldScheme => Enrollments.update(oldScheme, req.body))
    .then(oldScheme => oldScheme.update(req.body))
    .then(newScheme => res.json(newScheme))
    .catch(err => next(err, req, res, null));
};

const publish = (req, res) => {
  return setStatus(req.params.id, 'published')
    .then(() => res.json({}));
}

const draft = (req, res) => {
  return setStatus(req.params.id, 'draft')
    .then(() => res.json({}));
}

const getEnrollments = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(scheme => Enrollments.get(scheme.id))
    .then(e => res.json(e));
}

const getEnrollmentQueues = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(scheme => Enrollments.getQueue(scheme.id))
    .then(e => res.json(e));
}

const attachScheme = (req, res, next) => {
  TournamentSchemes
    .findById(req.params.id, {
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }
          ]
        }
      ]
    })
    .then(scheme => req.scheme = scheme)
    .then(() => next());
}

const attachLinkedScheme = (req, res, next) => {
  TournamentSchemes
    .findOne({
      where: {
        groupPhaseId: req.scheme.id
      },
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }
          ]
        }
      ]
    })
    .then(linkedScheme => req.linkedScheme = linkedScheme)
    .then(() => next());
}

const enroll = (req, res, next) => {
  return db.sequelize
    .transaction(function (trn) {
      return Teams
        .findOne({
          where: {
            user1Id: req.query.userId
          },
          transaction: trn
        })
        .then(team => TournamentSchemes.enroll(req.params.id, team))
    })
    .then(({ teamId }) => {
      notifyTeam(req.params.id, teamId, EmailType.REGISTER);
      return res.json({});
    });
}

const cancelEnroll = (req, res, next) => {
  const userId = req.query.userId;

  let sp = TournamentSchemes.findById(req.params.id);
  let tp = Teams.findAll({
    where: {
      [Op.or]: {
        user1Id: userId,
        user2Id: userId
      }
    }
  });

  return Promise
    .all([sp, tp])
    .then(([scheme, teams]) => Enrollments.cancelEnroll(scheme.id, teams.map(t => t.id)))
    .then(teamId => {
      notifyTeam(req.params.id, teamId, EmailType.UNREGISTER);
      return res.json({});
    });
}

function notifyTeam(schemeId, teamId, emailType) {
  return Promise
    .all([
      _get(schemeId),
      Teams.findById(teamId, {
        include: [{ model: Users, as: 'user1' }, { model: Users, as: 'user2' }]
      }),
      Users.findOne({
        where: {
          isSystemAdministrator: true
        },
        include: [{ model: SmtpCredentials, as: 'smtp' }]
      })
    ])
    .then(([scheme, team, sysadmin]) => sendEmail(emailType, sysadmin.smtp, {
      tournamentName: scheme.TournamentEdition.Tournament.name,
      editionName: scheme.TournamentEdition.name,
      schemeName: scheme.name
    },
      [team.user1.email].concat((team.user2 ? [team.user2.email] : []))
    ));
}

function setStatus(id, status) {
  return TournamentSchemes
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

router.get('/', find);
router.get('/:id', get);
router.get('/:id/winner', attachScheme, getWinner);
router.get('/:id/collect', collect);
router.post('/', auth, create);
router.post('/edit', auth, edit);
router.get('/:id/publish', auth, publish);
router.get('/:id/draft', auth, draft);
router.get('/:id/enrollments', getEnrollments);
router.get('/:id/enroll', auth, enroll);
router.get('/:id/cancelEnroll', auth, cancelEnroll);
router.get('/:id/queue', getEnrollmentQueues);
router.use('/:id/draws', attachScheme, attachLinkedScheme, require('./draws'));
module.exports = router;