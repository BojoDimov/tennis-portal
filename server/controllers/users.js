const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const crypto = require('crypto');
const { Teams } = require('../models');

const registerUser = (req, res, next) => {
  let model = req.body;
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
  hash.update(model.passwordSalt + req.body.password);
  model.passwordHash = hash.digest('hex').slice(40);

  return Teams
    .create({ user1: model, user1Id: -1 }, { include: ['user1'] })
    .then(user => res.json({}))
    .catch(err => next(err, req, res, null));
}

router.post('/', registerUser);

module.exports = router;