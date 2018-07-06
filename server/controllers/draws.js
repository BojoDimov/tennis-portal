const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const { Rankings, Groups, Matches, Draws, Enrollments } = require('../models');

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
    .catch(() => next({ name: 'DomainActionError', message: 'Invalid action: draw scheme' }, req, res, null))
    .then(() => Enrollments.get(req.scheme.id))
    .then(teams => Draws.create(req.scheme, seed, teams))
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
      return Draws.get(req.scheme, trn)
        .then(e => {
          if (e.schemeType == 'elimination')
            return Matches.generatePoints(req.scheme, e.data, true);
          else {
            let matches = [];
            e.data.forEach(group => matches = matches.concat(group.matches));
            return Matches.generatePoints(req.scheme, matches, false);
          }
        })
        .then(points => {
          let keys = Object.keys(points).filter(e => e != "null").map(e => parseInt(e));
          return Promise.all([points, Rankings.findAll({
            where: {
              userId: keys,
              tournamentId: req.scheme.TournamentEdition.Tournament.id
            },
            transaction: trn
          })])
        })
        .then(([points, rankings]) => {
          var create = Object.keys(points).filter(k => k != "null" && !rankings.find(r => r.userId == k)).map(k => {
            return {
              userId: k,
              tournamentId: req.scheme.TournamentEdition.tournamentId,
              points: points[k]
            };
          });
          return Promise.all(rankings.map(e => e.update({ points: e.points + points[e.userId] }, { transaction: trn }))
            .concat(Rankings.bulkCreate(create, { transaction: trn })));
        })
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

router.get('/', get)
router.post('/', create);
router.get('/finalize', finalize);
module.exports = router;