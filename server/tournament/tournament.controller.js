const express = require('express');
const router = express.Router();
const TournamentsService = require('./tournament.service');

const getAll = (req, res, next) => {
  return TournamentsService
    .getAll()
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const get = (req, res, next) => {
  return TournamentsService
    .get(req.params.id)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

router.get('/', getAll);
router.get('/:id', get);

module.exports = router;