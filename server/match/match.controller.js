const express = require('express');
const router = express.Router();
const MatchesService = require('./match.service');

const getAll = (req, res, next) => {
  return MatchesService
    .getAll(req.scheme.id)
    .then(e => res.json(e));
}

const get = (req, res, next) => {

}

const create = (req, res, next) => {

}

const update = (req, res, next) => {

}

const remove = (req, res, next) => {

}

const getEliminationMatches = async (req, res, next) => {
  const matches = await MatchesService.getEliminationMatches(req.scheme);
  return res.json({
    matches,
    scheme: req.scheme
  });
}

const getGroupMatches = async (req, res, next) => {
  const matches = await MatchesService.getGroupMatches(req.scheme);
  return res.json(matches);
}


router.get('/elimination', getEliminationMatches);
router.get('/groups', getGroupMatches);
router.get('/:id', get);
router.post('/', create);
router.post('/:id', update);
router.delete('/:id', remove);

module.exports = router;