const express = require('express');
const router = express.Router();
const SchemeService = require('./scheme.service');

const get = (req, res) => {
  return SchemeService
    .get(req.params.id)
    .then(e => {
      if (!e)
        res.status(404).send(null);
      else return res.json(e);
    })
    .catch(err => next(err, req, res, null));
}

const getAll = (req, res, next) => {
  return SchemeService
    .getAll()
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const includeScheme = (req, res, next) => {
  return SchemeService
    .get(req.params.id)
    .then(scheme => {
      req.scheme = scheme;
      next();
    });
}

router.get('/', getAll);
router.get('/:id', get);
router.use('/:id/enrollments', includeScheme, require('../enrollment/enrollment.controller'));
router.use('/:id/matches', includeScheme, require('../match/match.controller'));

module.exports = router;