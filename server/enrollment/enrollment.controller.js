const express = require('express');
const router = express.Router();
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');
const auth = require('../infrastructure/middlewares/auth');
const TeamsService = require('../team/team.service');
const EnrollmentsService = require('./enrollment.service');

const { Teams, sequelize } = require('../db');

const getAll = (req, res, next) => {
  return EnrollmentsService
    .getAll(req.scheme)
    .then(e => res.json(e));
}

const create = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const team = await TeamsService.findOrCreate(req.body, transaction);

    const enrollmentData = {
      scheme: req.scheme,
      team: team,
      user1Id: team.user1Id,
      user2Id: team.user2Id,
      shouldValidate: false
    };

    await EnrollmentsService.enroll(enrollmentData, transaction);

    await transaction.commit();
    return res.json({});
  }
  catch (err) {
    await transaction.rollback();
    return next(err, req, res, null);
  }
}

const remove = (req, res, next) => {
  return EnrollmentsService
    .cancelEnroll(req.params.id)
    .then(e => res.json(e));
}

//this is enrollment for single teams
const enroll = async (req, res, next) => {
  try {
    const team = await TeamsService.get(req.user.id);
    const enrollmentData = {
      scheme: req.scheme,
      team: team,
      user1Id: req.user.id,
      user2Id: null,
      shouldValidate: true
    }
    await EnrollmentsService.enroll(enrollmentData);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const cancelEnroll = async (req, res, next) => {
  try {
    await EnrollmentsService.cancelEnroll(req.params.enrollmentId);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.get('/enroll', auth, enroll);
router.delete('/:enrollmentId/cancelEnroll', auth, cancelEnroll);
router.get('/', getAll);
router.post('/', adminIdentity, create);
router.delete('/:id', adminIdentity, remove);
module.exports = router;