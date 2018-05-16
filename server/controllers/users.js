const { Users } = require('../sequelize.config');
const crypto = require('crypto');

const registerUser = (req, res) => {
  let model = req.body;
  let hasher = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('utf8');
  hasher.update(model.passwordSalt + req.body.password);
  model.passwordHash = hasher.digest('hex');

  Users.create(model).then(() => res.json({}));
};

const authenticateUser = (req, res) => {
  let password = req.body.password;
  Users.findOne()
    .then(user => {
      let hasher = crypto.createHash('sha256');
      hasher.update(user.passwordSalt + password);
      if (hasher.digest('hex') == user.passwordHash)
        return 'authenticated';
      else return 'invalid authentication'
    });
};

module.exports = {
  init: (app) => {
    app.post('/api/users', registerUser);
    app.post('/api/login', authenticateUser);
  }
}