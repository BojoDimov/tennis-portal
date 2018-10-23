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

router.get('/', auth, getAll);
router.post('/', create);

module.exports = router;