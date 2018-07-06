const express = require('express');
const router = express.Router();
const {
  Tournaments,
  TournamentEditions,
  TournamentSchemes
} = require('../db');

const find = (req, res) => {
  return TournamentEditions
    .findAll()
    .then(editions => res.json(editions));
};

const get = (req, res) => {
  return TournamentEditions
    .findById(req.params.id, {
      include: [
        { model: TournamentSchemes, as: 'schemes' },
        { model: Tournaments }
      ]
    })
    .then(e => res.json(e));
};

const create = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';
  return TournamentEditions
    .create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const edit = (req, res, next) => {
  return TournamentEditions
    .findById(req.body.id)
    .then(e => e.update(req.body))
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const publish = (req, res) => {
  return setStatus(req.params.id, 'published')
    .then((e) => res.json(e));
}

const draft = (req, res) => {
  return setStatus(req.params.id, 'draft')
    .then((e) => res.json(e));
}

const setStatus = (id, status) => {
  return TournamentEditions
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

router.get('/', find);
router.get('/:id', get);
router.get('/:id/publish', publish);
router.get('/:id/draft', draft);
router.post('/', create);
router.post('/edit', edit);
module.exports = router;