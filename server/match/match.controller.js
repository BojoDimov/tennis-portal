const express = require('express');
const router = express.Router();
const MatchesService = require('./match.service');
const identity = require('../infrastructure/middlewares/identity');

const update = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await MatchesService.update(req.params.matchId, req.body, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const create = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await MatchesService.create(req.body, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await MatchesService.delete(req.params.matchId, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const getEliminationMatches = async (req, res, next) => {
  const matches = await MatchesService.getEliminationMatches(req.scheme);
  return res.json({
    matches,
    scheme: req.scheme
  });
}

const getGroupMatches = async (req, res, next) => {
  const groups = await MatchesService.getGroupMatches(req.scheme);

  return res.json({
    groups,
    scheme: req.scheme
  })
}


router.get('/elimination', getEliminationMatches);
router.get('/groups', getGroupMatches);
router.post('/:matchId', identity, update);
router.post('/', identity, create);
router.delete('/:matchId', identity, remove);
module.exports = router;