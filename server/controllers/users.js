const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const crypto = require('crypto');
const { Teams, Enrollments, UserDetails, Users } = require('../models');

const registerUser = (req, res, next) => {
  let model = req.body;
  let hash = crypto.createHash('sha256');
  model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
  hash.update(model.passwordSalt + req.body.password);
  model.passwordHash = hash.digest('hex').slice(40);
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
    .findOne({
      where: {
        user1Id: userId
      }
    })
    .then(team => Enrollments.getEnrolled(team.id))
    .then(e => res.json(e));
}

router.get('/:id/enrolled', auth, getEnrolled);
router.get('/:id', get);
router.post('/:id', auth, update);
router.post('/', registerUser);

module.exports = router;