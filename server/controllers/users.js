const crypto = require('crypto');
const { Users } = require('../sequelize.config');

const registerUser = (req, res, next) => {
  let model = req.body;
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('utf8', 0, 16);
  hash.update(model.passwordSalt + req.body.password);
  model.passwordHash = hash.digest('hex').slice(40);

  Users.create(model)
    .then(user => res.json({}))
    .catch(err => next(err, req, res, null));
};

const authenticateUser = (req, res) => {
  let password = req.body.password;
  Users.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    let hash = crypto.createHash('sha256');
    hash.update(user.passwordSalt + password);
    if (hash.digest('hex').slice(40) === user.passwordHash)
      res.send({ authenticated: true });
    else res.send({ authenticated: false });
  });
};

module.exports = {
  init: (app) => {
    app.post('/api/users', registerUser);
    app.post('/api/login', authenticateUser);
  }
}
