const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes,
  Enrollments, Groups, Matches, Draws, Teams, Users, SmtpCredentials, Sets, Payments
} = require('../models');
const db = require('../db');
const Op = db.Sequelize.Op;
const { EmailType } = require('../enums');
const auth = require('../middlewares/auth');
const Enums = require('../enums');
const { notifyTeam, getScheme, cancelUserEnrollment } = require('../services/scheme.service');
const { encodePayment } = require('../services/payments.service');

const find = (req, res) => {
  return TournamentSchemes
    .findAll({
      where: req.query
    })
    .then(schemes => res.json(schemes));
};

const get = (req, res) => {
  return getScheme(req.params.id).then(e => res.json(e));
};

const getWinner = (req, res, next) => {
  if (req.scheme.status != Enums.Status.FINALIZED)
    next({ name: 'DomainActionError', error: { message: 'Invalid action: get winner' } }, req, res, null);

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

  let enrollment = Enrollments.getEnrollmentData(userId, req.params.id);
  //let payment = encodePayment(req.params.id, userId);

  return TournamentSchemes
    .findById(req.params.id, {
      include: [
        { model: TournamentEditions },
        { model: TournamentSchemes, as: 'groupPhase' }
      ]
    })
    .then(scheme => Promise
      .all([
        Promise.resolve(scheme),
        enrollment,
        //payment,
        Enrollments.get(scheme.id, null, true),
        Enrollments.getQueue(scheme.id),
        Draws.get(scheme)
      ])
    )
    .then(([scheme, enrollment, enrollments, queue, draw]) => {
      return res.json({
        scheme, enrollment, enrollments, queue, draw
      })
    });
}

const create = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';
  model.ageFrom = parseInt(model.ageFrom) || null;
  model.ageTo = parseInt(model.ageTo) || null;

  return TournamentSchemes.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const edit = (req, res, next) => {
  let model = req.body;
  model.ageFrom = parseInt(model.ageFrom) || null;
  model.ageTo = parseInt(model.ageTo) || null;

  return TournamentSchemes
    .findById(req.body.id)
    .then(oldScheme => Enrollments.update(oldScheme, model))
    .then(oldScheme => oldScheme.update(model))
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
    .then(scheme => {
      let limit = null;
      if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        limit = scheme.maxPlayerCount;
      else if (scheme.schemeType == Enums.SchemeType.GROUP)
        limit = scheme.groupCount * scheme.teamsPerGroup;

      return Enrollments.get(scheme.id, limit)
    })
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
        .then(team => TournamentSchemes.enroll(req.params.id, team, trn))
    })
    .then(({ teamId }) => {
      notifyTeam(req.params.id, teamId, EmailType.REGISTER);
      return res.json({});
    })
    .catch(err => next(err, req, res, null));
}

const cancelEnroll = (req, res, next) => {
  return cancelUserEnrollment(req.params.id, req.query.userId)
    .then(() => res.json({}))
    .catch(err => next(err, req, res, null));
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