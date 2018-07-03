const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Users = require('../models/users');

const login = (req, res, next) => {
  let password = req.body.password;
  return Users
    .findOne({
      where: { email: req.body.email }
    })
    .then(user => {
      let hash = crypto.createHash('sha256');
      hash.update(user.passwordSalt + password);

      if (hash.digest('hex').slice(40) === user.passwordHash)
        return Users.issueToken(user.id, req.ip);
      else
        return { authenticated: false };
    })
    .then(token => res.send(token))
    .catch(err => next(err, req, res, null));
};

router.post('/', login);

module.exports = router;