const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const {
  Groups,
  GroupTeams,
  Matches,
  Enrollments
} = require('../models');

const removeTeam = (req, res, next) => {
  let teamId = req.query.teamId;

  return sequelize
    .transaction(function (trn) {
      let p1 = GroupTeams
        .findOne({
          where: {
            groupId: req.params.id,
            teamId: teamId
          }
        })
        .then(gt => {
          gt.teamId = null;
          return gt.save({ transaction: trn });
        });

      let p2 = Groups
        .findById(req.params.id)
        .then(group => Enrollments.enqueue(group.schemeId, teamId, trn));

      return Promise.all([p1, p2]);
    })
    .then(r => res.json(r))
    .catch(err => next(err, req, res, null));
}

const addTeam = (req, res, next) => {
  let teamId = parseInt(req.query['teamId']);
  return sequelize
    .transaction(function (trn) {
      let p1 = GroupTeams
        .findById(req.query.groupTeamId, { transaction: trn })
        .then(gt => {
          gt.teamId = teamId
          return gt.save();
        });

      let p2 = Groups
        .findById(req.params.id, { transaction: trn })
        .then(group => Enrollments.dequeue(group.schemeId, teamId, trn));

      return Promise.all([p1, p2]);
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

router.get('/:id/removeTeam', removeTeam);
router.get('/:id/addTeam', addTeam);
module.exports = router;