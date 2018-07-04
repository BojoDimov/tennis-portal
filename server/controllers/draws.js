const express = require('express');
const router = express.Router();
const {
  Tournaments, TournamentEditions, TournamentSchemes, Rankings,
  GroupTeams,
  sequelize
} = require('../db');
const DrawActions = require('../logic/drawActions');
const EnrollmentsActions = require('../logic/enrollmentsActions');
const Groups = require('../models/groups');
const Matches = require('../models/matches');
const Draws = require('../models/draws');

const create = (req, res, next) => {
  let scheme = null;
  let seed = !parseInt(req.body.seed) ? 0 : parseInt(req.body.seed);

  return Matches
    .findAll({
      where: {
        schemeId: req.params.id
      }
    })
    .then(matches => {
      if (matches.length > 0)
        throw null;
    })
    .catch(() => next({ name: 'DomainActionError', message: 'Invalid action: draw scheme' }, req, res, null))
    .then(() => TournamentSchemes.findById(req.params.id))
    .then(e => {
      scheme = e;
      return EnrollmentsActions._get(sequelize, e.id)
    })
    .then(e => {
      if (scheme.schemeType == 'elimination') {
        let matches = DrawActions._draw_eliminations(scheme, seed, e)
        return Matches.bulkCreate(matches);
      }
      else if (scheme.schemeType == 'round-robin') {
        let groups = DrawActions._draw_groups(scheme, seed, e);
        return Promise.all(groups.map(group => Groups.create(group, {
          include: [
            { model: GroupTeams, as: 'teams' }
          ]
        })));
        //return Groups.bulkCreate(groups);
      }
    })
    .then(() => Draws.getDrawData(scheme))
    .then(data => res.json(data));
}

const get = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(scheme => Draws.getDrawData(scheme))
    .then(data => res.json(data));
}


const finalize = (req, res, next) => {
  let scheme = null;

  return sequelize
    .transaction(function (trn) {
      return TournamentSchemes
        .findById(req.params.id, {
          transaction: trn,
          include: [
            {
              model: TournamentEditions,
              include: [
                { model: Tournaments }
              ]
            }
          ]
        })
        .then(e => {
          scheme = e;
          return Draws.getDrawData(scheme, trn);
        })
        .then(e => {
          if (e.schemeType == 'elimination')
            return Matches.generatePoints(scheme, e.data, true);
          else {
            let matches = [];
            e.data.forEach(group => matches = matches.concat(group.matches));
            return Matches.generatePoints(scheme, matches, false);
          }
        })
        .then(points => {
          let keys = Object.keys(points).filter(e => e != "null").map(e => parseInt(e));
          return Promise.all([points, Rankings.findAll({
            where: {
              userId: keys,
              tournamentId: scheme.TournamentEdition.Tournament.id
            },
            transaction: trn
          })])
        })
        .then(([points, rankings]) => {
          var create = Object.keys(points).filter(k => k != "null" && !rankings.find(r => r.userId == k)).map(k => {
            return {
              userId: k,
              tournamentId: scheme.TournamentEdition.tournamentId,
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