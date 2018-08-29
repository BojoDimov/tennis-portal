const express = require('express');
const router = express.Router();
const { Status } = require('../enums');
const { sequelize } = require('../db');
const { Rankings, Groups, Matches, Draws, Enrollments } = require('../models');
const { SchemeType } = require('../enums');

const create = (req, res, next) => {
  let seed = !parseInt(req.body.seed) ? 0 : parseInt(req.body.seed);

  return Matches
    .findAll({
      where: {
        schemeId: req.scheme.id
      }
    })
    .then(matches => {
      if (matches.length > 0)
        throw null;
    })
    .catch(() => next({ name: 'DomainActionError', error: { message: 'Invalid action: draw scheme' } }, req, res, null))
    .then(() => {
      let limit = null;
      if (req.scheme.schemeType == SchemeType.ELIMINATION)
        limit = req.scheme.maxPlayerCount;
      else if (req.scheme.schemeType == SchemeType.GROUP)
        limit = req.scheme.groupCount * req.scheme.teamsPerGroup;

      return Promise.all([
        Enrollments.get(req.scheme.id, limit),
        Enrollments.transferUnpaid(req.scheme.id, limit)
      ]);
    })
    .then(([teams, _]) => Draws.create(req.scheme, seed, teams))
    .then(() => Draws.get(req.scheme))
    .then(data => res.json(data));
}

const get = (req, res) => {
  return Draws.get(req.scheme)
    .then(data => res.json(data));
}

const finalize = (req, res, next) => {
  return sequelize
    .transaction(function (trn) {
      return Draws
        .get(req.scheme, trn)
        .then(draw => Rankings.update(req.scheme, draw, trn))
        .then(draw => Draws.finalize(req.linkedScheme, draw, trn))
        .then(() => {
          req.scheme.status = Status.FINALIZED;
          return req.scheme.save({ transaction: trn });
        })
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

router.get('/', get)
router.post('/', create);
router.get('/finalize', finalize);
module.exports = router;