const router = require('express').Router();
const auth = require('../infrastructure/middlewares/auth');
const UserService = require('./user.service');

const getAll = (req, res, next) => {
  return UserService
    .getAll()
    .then(e => res.json(e));
}

const create = (req, res, next) => {
  return UserService
    .create(req.body)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const update = (req, res, next) => {
  return UserService
    .update(req.params.id, req.body)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return UserService
    .delete(req.params.id)
    .then(_ => res.json({}))
    .catch(err => next(err, req, res, null));
}

router.get('/', auth, getAll);
router.post('/:id', update);
router.post('/', create);
router.delete('/:id', auth, remove);

module.exports = router;