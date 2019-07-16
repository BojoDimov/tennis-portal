const express = require('express');
const router = express.Router();
const MatchesService = require('./match.service');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

const update = async (req, res, next) => {
  try {
    await MatchesService.update(req.params.matchId, req.body, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const create = async (req, res, next) => {
  try {
    await MatchesService.create(req.body, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
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
router.post('/:matchId', adminIdentity, update);
router.post('/', adminIdentity, create);
router.delete('/:matchId', adminIdentity, remove);
module.exports = router;