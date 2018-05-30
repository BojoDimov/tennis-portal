const crypto = require('crypto');
const { Users, Tokens } = require('../sequelize.config');

const registerUser = (req, res, next) => {
  let model = req.body;
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
  hash.update(model.passwordSalt + req.body.password);
  model.passwordHash = hash.digest('hex').slice(40);

  Users.create(model)
    .then(user => res.json({}))
    .catch(err => next(err, req, res, null));
};

const login = (req, res, next) => {
  let password = req.body.password;
  Users.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    let hash = crypto.createHash('sha256');
    hash.update(user.passwordSalt + password);

    if (hash.digest('hex').slice(40) === user.passwordHash)
      return issueToken(user.id, req);
    else
      return { authenticated: false };
  }).then(token => res.send(token))
    .catch(err => next(err, req, res, null));
};

const issueToken = (userId, req) => {
  return Tokens.findOne({
    where: {
      userId: userId
    }
  }).then(token => {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    if (token)
      return token.update({
        token: crypto.randomBytes(40).toString('hex').slice(40),
        expires: expires,
        issued: req.ip
      });
    else
      return Tokens.create({
        userId: userId,
        token: crypto.randomBytes(40).toString('hex').slice(40),
        expires: expires,
        issued: req.ip
      });
  });
}

module.exports = {
  init: (app) => {
    app.post('/api/users', registerUser);
    app.post('/api/login', login);
  }
}
