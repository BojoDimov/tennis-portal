const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const {
  Matches,
  Enrollments
} = require('../models');

const removeTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return sequelize
    .transaction(function (trn) {
      return Matches
        .findById(req.params.id, {
          include: Matches.getIncludes(),
          transaction: trn
        })
        .then(match => {
          let team = null;
          if (pos == 1) {
            team = match.team1;
            match.team1Id = null;
            match.seed1 = null;
          }
          else {
            team = match.team2;
            match.team2Id = null;
            match.seed2 = null;
          }

          return Promise.all([
            Enrollments.enqueue(match.schemeId, team.id, trn),
            match.save({ transaction: trn })
          ]);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const setTeam = (req, res, next) => {
  let teamId = req.query['teamId'];
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return sequelize
    .transaction(function (trn) {
      return Matches
        .findById(req.params.id, {
          include: Matches.getIncludes()
        })
        .then(match => {
          if (pos == 1)
            match.team1Id = teamId;
          else
            match.team2Id = teamId;

          return Promise.all([
            Enrollments.dequeue(match.schemeId, teamId, trn),
            match.save({ transaction: trn })
          ]);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const update = (req, res, next) => {
  let withdraw = req.body.withdraw;
  let matchId = req.params.id;
  let sets = req.body.sets;
  sets.forEach(set => set.matchId = matchId);

  return sequelize
    .transaction(function (trn) {
      return Matches.manageSets(sets, trn)
        .then(() => Matches
          .findById(matchId, {
            include: Matches.getIncludes(),
            order: [
              ['sets', 'order', 'asc']
            ],
            transaction: trn
          })
          .then(match => {
            match.withdraw = withdraw;
            return match.save({ transaction: trn });
          }))
        .then(match => {
          if (match.scheme.schemeType == 'elimination')
            return Matches.manageNextMatch(match, trn);
          else return Promise.resolve(match);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const create = (req, res, next) => {
  let match = req.body;
  match.sets = match.sets.filter((set) => (set.team1 || set.team2));
  match.sets = match.sets.map(Matches.parseSet);

  return sequelize
    .transaction(function (trn) {
      return Matches
        .create(match, {
          include: Matches.getIncludes(),
          transaction: trn
        })
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const getAll = (req, res, next) => {
  return Matches.findAll({
    include: Matches.getIncludes()
  }).then(e => res.json(e));
}

router.get('/:id/removeTeam', removeTeam);
router.get('/:id/setTeam');
router.post('/', create);
router.post('/:id', update);
router.get('/', getAll);
module.exports = router;