const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const crypto = require('crypto');
const { Teams, Enrollments, UserDetails, Users, UserActivationCodes, SmtpCredentials } = require('../models');
const Op = require('../db').Sequelize.Op;
const { sendEmail } = require('../emailService');
const { EmailType } = require('../enums');
const db = require('../db');
// const env = process.argv.slice(-1)[0];
const env = process.env.NODE_ENV || 'dev';
const config = require('../../config')[env];

function validatePassword(password) {
  let isValid = password.match(/(?=.*\d)(?=.*[a-z, а-я])(?=.*[A-Z, А-Я]).{8,}/);
  if (!isValid)
    throw { name: 'DomainActionError', password: true };
}

function setPassword(model, password) {
  validatePassword(password);
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
  hash.update(model.passwordSalt + password);
  model.passwordHash = hash.digest('hex').slice(40);
}


const registerUser = (req, res, next) => {
  let model = req.body;

  try {
    setPassword(model, req.body.password);
  }
  catch (err) {
    next(err, req, res, null);
  }

  model.details = {};
  return Teams
    .create({ user1: model, user1Id: -1 }, {
      include: [
        { model: Users, as: 'user1', include: ['details'] }
      ]
    })
    .then(team => sendActivationEmail(team.user1))
    .then(() => res.json({}))
    .catch(err => next(err, req, res, null));
}

function sendActivationEmail(user) {
  let token = crypto.randomBytes(16).toString('hex');
  let activation = config.client + `/activation?token=${token}`;
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  return UserActivationCodes
    .create({ userId: user.id, token: token, expires: expires })
    .then(() => Users.findOne({
      where: {
        isSystemAdministrator: true
      },
      include: [{ model: SmtpCredentials, as: 'smtp' }]
    }))
    .then(({ smtp }) => sendEmail(EmailType.ACTIVATION, smtp, { activation }, [user.email]));
}

const sendPasswordRecovery = (req, res, next) => {
  let token = crypto.randomBytes(16).toString('hex');
  let recovery = config.client + `/recovery?token=${token}`;
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
  return db.sequelize
    .transaction(function (trn) {
      return UserActivationCodes
        .findOne({
          where: {
            token: req.body.token
          },
          include: [{ model: Users, as: 'user' }]
        })
        .then(uac => {
          if (uac == null)
            throw { name: 'DomainActionError', invalidToken: true };

          if (uac.user.birthDate != req.body.birthDate)
            throw { name: 'DomainActionError', birthDate: true };

          setPassword(uac.user, req.body.password);
          return uac.user.save({ transaction: trn });
        })
        .then(() => UserActivationCodes.destroy({ where: { token: req.body.token }, transaction: trn }))
    })
    .catch(err => next(err, req, res, null))
    .then(() => res.json({}));
}

const activateUser = (req, res, next) => {
  return db.sequelize
    .transaction(function (trn) {
      return UserActivationCodes
        .findOne({
          where: {
            token: req.body.token
          },
          include: [{ model: Users, as: 'user' }]
        })
        .then(uac => {
          if (uac == null)
            throw { name: 'DomainActionError', invalidToken: true };

          uac.user.isActive = true;
          return uac.user.save({ transaction: trn });
        })
        .then(() => UserActivationCodes.destroy({ where: { token: req.body.token }, transaction: trn }))
    })
    .catch(err => next(err, req, res, null))
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
  if (req.user.id != req.params.id || req.user.id != req.body.details.userId)
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
router.post('/activation', activateUser);
router.get('/:id/enrolled', auth, getEnrolled);
router.get('/:id', get);
router.post('/:id', auth, update);
router.post('/', registerUser);

module.exports = router;