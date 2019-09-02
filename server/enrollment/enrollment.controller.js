const express = require('express');
const router = express.Router();
const identity = require('../infrastructure/middlewares/identity');
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
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

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
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  return EnrollmentsService
    .cancelEnroll(req.params.id)
    .then(e => res.json({}));
}

//this is enrollment for single teams
const enroll = async (req, res, next) => {
  try {
    const team = await TeamsService.getUserTeam(req.user.id);
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
router.post('/', identity, create);
router.delete('/:id', identity, remove);
module.exports = router;