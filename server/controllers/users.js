const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const crypto = require('crypto');
const { Teams, Enrollments, UserDetails, Users, UserActivationCodes, SmtpCredentials } = require('../models');
const Op = require('../db').Sequelize.Op;
const { sendEmail } = require('../emailService');
const { EmailType } = require('../enums');
var config = require(__dirname + '/../../config.js');

function setPassword(model, password) {
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
  hash.update(model.passwordSalt + password);
  model.passwordHash = hash.digest('hex').slice(40);
}

const registerUser = (req, res, next) => {
  let model = req.body;
  setPassword(model, req.body.password);
  model.details = {};
  return Teams
    .create({ user1: model, user1Id: -1 }, {
      include: [
        { model: Users, as: 'user1', include: ['details'] }
      ]
    })
    .then(user => res.json({}))
    .catch(err => next(err, req, res, null));
}

const sendPasswordRecovery = (req, res, next) => {
  let token = crypto.randomBytes(16).toString('hex');
  let recovery = config.frontEnd + `/recovery?token=${token}`;
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  return Users
    .findOne({ where: { email: req.query.email } })
    .then(user => UserActivationCodes.create({ userId: user.id, token: token, expires: expires }))
    .then(() => Users.findOne({
      where: {
        isSystemAdministrator: true
      },
      include: [{ model: SmtpCredentials, as: 'smtp' }]
    }))
    .then(({ smtp }) => sendEmail(EmailType.RECOVERY, smtp, { recovery }, [req.query.email]))
    .then(() => res.json({}));
}

const acceptPasswordRecovery = (req, res, next) => {
  return UserActivationCodes
    .findOne({
      where: {
        token: req.body.token
      },
      include: [{ model: Users, as: 'user' }]
    })
    .then(uac => {
      if (uac == null || uac.user.birthDate != req.body.birthDate)
        next({ name: 'DomainActionError', message: 'Invalid action: recover account' }, req, res, null);
      setPassword(uac.user, req.body.password);
      return uac.user.save();
    })
    .then(() => UserActivationCodes.destroy({ where: { token: req.body.token } }))
    .then(() => res.json({}));
}

const get = (req, res, next) => {
  return Users
    .findById(req.params.id, {
      include: [{ model: UserDetails, as: 'details' }],
      attributes: ['id', 'gender', 'email', 'birthDate', 'name']
    })
    .then(e => res.json(e));
}


const update = (req, res, next) => {
  if (req.user.id != req.params.id)
    next({ name: 'DomainActionError', message: 'Invalid action: update user' }, req, res, null);

  return Users
    .findById(req.params.id, {
      include: [{
        model: UserDetails,
        as: 'details'
      }],
      attributes: ['id', 'gender', 'name', 'birthDate']
    })
    .then(user => user.details.update(req.body.details))
    .then(e => res.json(e));
}

const getEnrolled = (req, res, next) => {
  let userId = req.params.id;

  return Teams
    .findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId
        }
      }
    })
    .then(teams => Enrollments.getEnrolled(teams.map(e => e.id)))
    .then(e => res.json(e));
}

router.get('/recovery', sendPasswordRecovery);
router.post('/recovery', acceptPasswordRecovery);
router.get('/:id/enrolled', auth, getEnrolled);
router.get('/:id', get);
router.post('/:id', auth, update);
router.post('/', registerUser);

module.exports = router;