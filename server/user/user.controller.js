const express = require('express');
const router = express.Router();
const UserService = require('./user.service');

const getAll = (req, res, next) => {
  return UserService
    .getAll()
    .then(e => res.json(e));
}

router.get('/', getAll);

module.exports = router;