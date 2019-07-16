const router = require('express').Router();
const crypto = require('crypto');
const { Users } = require('../db');
const UserService = require('./user.service');

const login = async (req, res, next) => {
  let password = req.body.password;
  const user = await Users.
    findOne({
      where: { email: req.body.email.trim(), isActive: true }
    });

  if (!user)
    return next({ name: 'DomainActionError', error: { login: 'invalid credentials' } }, req, res, null);

  let hash = crypto.createHash('sha256');
  hash.update(user.passwordSalt + password);

  if (hash.digest('hex').slice(40) === user.passwordHash) {
    const token = await UserService.issueToken(user.id, req.ip);
    res.json({ token });
  }
  else
    return next({ name: 'DomainActionError', error: { login: 'invalid credentials' } }, req, res, null);
};

router.post('/', login);

module.exports = router;