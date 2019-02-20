const express = require('express');
const router = express.Router();
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');
const auth = require('../infrastructure/middlewares/auth');
const TeamsService = require('../team/team.service');
const EnrollmentsService = require('./enrollment.service');

const getAll = (req, res, next) => {
  return EnrollmentsService
    .getAll(req.scheme)
    .then(e => res.json(e));
}

const create = (req, res, next) => {
  return EnrollmentsService
    .enroll(req.body)
    .then(e => res.json(e));
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
      schemeId: req.scheme.id,
      teamId: team.id,
      user1Id: req.user.id,
      user2Id: null
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