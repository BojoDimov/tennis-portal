const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes,
  Enrollments, Groups, Matches, Draws
} = require('../models');

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
router.use('/:id/draws', attachScheme, require('./draws'));
module.exports = router;