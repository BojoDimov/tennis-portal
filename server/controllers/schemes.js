const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes, Rankings,
  SchemeEnrollments, EnrollmentQueues,
  Sets, GroupTeams,
  Users,
  db } = require('../db');
const DrawActions = require('../logic/drawActions');
const EnrollmentsActions = require('../logic/enrollmentsActions');
const Groups = require('../models/groups');
const Matches = require('../models/matches');

const find = (req, res) => {
  return TournamentSchemes
    .findAll()
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
    .then(e => EnrollmentsActions._update(db, e, req.body))
    .then(e => e.update(req.body))
    .then(e => res.json(e))
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
    .then(e => EnrollmentsActions._get(db, e.id))
    .then(e => {
      return res.json(e);
    });
}

const getEnrollmentQueues = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(e => EnrollmentsActions._get_queue(db, e.id))
    .then(e => {
      return res.json(e);
    });
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
router.get('/:id/queue', getEnrollmentQueues);
router.use('/draws', require('./draws'));
module.exports = router;