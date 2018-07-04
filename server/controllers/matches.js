const express = require('express');
const router = express.Router();
const {
  TournamentSchemes,
  Sets,
  EnrollmentQueues,
  SchemeEnrollments,
  Users,
  sequelize
} = require('../db');
const Matches = require('../models/matches');


const removeTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return sequelize
    .transaction(function (trn) {
      return Matches
        .findById(req.params.id, {
          include: [
            { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
            { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
          ],
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

          let p1 = SchemeEnrollments.destroy({
            where: {
              schemeId: match.schemeId,
              userId: team.id
            },
            transaction: trn
          });

          let p2 = EnrollmentQueues.create({ schemeId: match.schemeId, userId: team.id }, { transaction: trn });

          let p3 = match.save({ transaction: trn });

          return Promise.all([p1, p2, p3]);
        });
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const setTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return Matches
    .findById(req.params.id, {
      include: [
        { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
        { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
      ]
    })
    .then(match => {
      if (pos == 1)
        match.team1Id = req.query['teamId'];
      else
        match.team2Id = req.query['teamId'];

      let p1 = EnrollmentQueues.destroy({
        where: {
          schemeId: match.schemeId,
          userId: req.query['teamId']
        }
      });

      let p2 = SchemeEnrollments.create({ schemeId: match.schemeId, userId: req.query['teamId'] });

      let p3 = match.save();

      return Promise.all([p1, p2, p3]);
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
            include: [
              { model: Sets, as: 'sets' },
              { model: TournamentSchemes, as: 'scheme' }
            ],
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
          include: [
            { model: Sets, as: 'sets' }
          ],
          transaction: trn
        })
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

router.get('/:id/removeTeam', removeTeam);
router.get('/:id/setTeam');
router.post('/', create);
router.post('/:id', update);
module.exports = router;