const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes,
  Enrollments, Groups, Matches, Draws, Teams,
} = require('../models');

const Enums = require('../enums');

const find = (req, res) => {
  return TournamentSchemes
    .findAll({
      where: req.query
    })
    .then(schemes => res.json(schemes));
};

const get = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id, {
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }]
        }
      ]
    })
    .then(e => res.json(e))
};

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
  const userId = req.query.userId;

  let sp = TournamentSchemes.findById(req.params.id);
  let tp = Teams.findOne({ where: { user1Id: userId } });

  return Promise
    .all([sp, tp])
    .then(([scheme, team]) => {
      let mpc = 0;
      if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        mpc = scheme.maxPlayerCount;
      else if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
        mpc = scheme.groupCount * scheme.teamsPerGroup;

      return Enrollments.enroll(scheme.id, team.id, mpc);
    })
    .then(() => res.json({}));
}

const cancelEnroll = (req, res, next) => {
  const userId = req.query.userId;

  let sp = TournamentSchemes.findById(req.params.id);
  let tp = Teams.findOne({ where: { user1Id: userId } });

  return Promise
    .all([sp, tp])
    .then(([scheme, team]) => Enrollments.cancelEnroll(scheme.id, team.id))
    .then(() => res.json({}));
}

function setStatus(id, status) {
  return TournamentSchemes
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

router.get('/', find);
router.get('/:id', get);
router.post('/', create);
router.post('/edit', edit);
router.get('/:id/publish', publish);
router.get('/:id/draft', draft);
router.get('/:id/enrollments', getEnrollments);
router.get('/:id/enroll', enroll);
router.get('/:id/cancelEnroll', cancelEnroll);
router.get('/:id/queue', getEnrollmentQueues);
router.use('/:id/draws', attachScheme, attachLinkedScheme, require('./draws'));
module.exports = router;