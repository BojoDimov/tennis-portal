const express = require('express');
const router = express.Router();
const EditionsService = require('./edition.service');

const getAll = (req, res, next) => {
  return EditionsService
    .getAll()
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const get = (req, res, next) => {
  return EditionsService
    .get(req.params.id)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return EditionsService
    .remove(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err, req, res, null));
}

router.get('/', getAll);
router.get('/:id', get);
router.delete('/:id', remove);

module.exports = router;