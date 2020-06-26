const express = require('express');
const router = express.Router();
const TeamsService = require('./team.service');
const identity = require('../infrastructure/middlewares/identity');

const getAll = async (req, res, next) => {
  try {
    let teams = await TeamsService.getAll(req.query);
    return res.json(teams);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await TeamsService.update(req.params.id, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const participateInTournaments = async (req, res, next) => {
  if (!req.user || req.user.team.id != req.params.id)
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await TeamsService.participateInTournaments(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}


router.get('/:id/participateInTournaments', identity, participateInTournaments);
router.get('/', getAll);
router.post('/:id', identity, update);
module.exports = router;