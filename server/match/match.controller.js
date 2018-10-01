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

router.get('/', getAll);
router.get('/:id', get);
router.post('/', create);
router.post('/:id', update);
router.delete('/:id', remove);

module.exports = router;