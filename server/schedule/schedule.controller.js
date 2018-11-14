const router = require('express').Router();
const ScheduleService = require('./schedule.service');
const auth = require('../infrastructure/middlewares/auth');
const identity = require('../infrastructure/middlewares/identity');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

const { ReservationType } = require('../infrastructure/enums');

const getSeasons = (_, res) => {
  return ScheduleService
    .getSeasons(true)
    .then(e => res.json(e));
}

const getCourts = (_, res) => {
  return ScheduleService
    .getCourts(true)
    .then(e => res.json(e));
}

const getCurrentConfig = (req, res, next) => {
  return ScheduleService
    .getCurrentConfig()
    .then(e => res.json(e));
}

const getReservations = (req, res, next) => {
  return ScheduleService
    .getReservations(req.body.date)
    .then(e => res.json(e));
}

const createSeason = (req, res, next) => {
  return ScheduleService
    .createSeason(req.body)
    .then(e => res.json(e));
}

const updateSeason = (req, res, next) => {
  return ScheduleService
    .updateSeason(req.params.id, req.body)
    .then(e => res.json(e));
}

const createCourt = (req, res, next) => {
  return ScheduleService
    .createCourt(req.body)
    .then(e => res.json(e));
}

const updateCourt = (req, res, next) => {
  return ScheduleService
    .updateCourt(req.params.id, req.body)
    .then(e => res.json(e));
}

const createReservation = async (req, res, next) => {
  const model = req.body;
  const user = req.user;

  if (user.isAdmin)
    model.administratorId = user.id;
  else {
    model.customerId = user.id;
    model.administratorId = null;
    model.payments = [];
    model.type = ReservationType.USER;
  }

  try {
    const reservation = await ScheduleService.createReservation(model, req.user);
    return res.json(reservation);
  }
  catch (e) {
    return next(e, req, res, null);
  }
}

const updateReservation = async (req, res, next) => {
  const model = req.body;
  model.administrator = req.user;
  model.administratorId = req.user.id;

  try {
    const reservation = await ScheduleService.updateReservation(req.params.id, model);
    return res.json(reservation);
  }
  catch (e) {
    return next(e, req, res, next);
  }
}

const cancelReservation = async (req, res, next) => {
  try {
    await ScheduleService.cancelReservation(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.get('/config', getCurrentConfig);
router.get('/seasons', adminIdentity, getSeasons);
router.get('/courts', adminIdentity, getCourts);

router.post('/seasons', adminIdentity, createSeason);
router.post('/seasons/:id', adminIdentity, updateSeason);

router.post('/courts', adminIdentity, createCourt);
router.post('/courts/:id', adminIdentity, updateCourt);

router.post('/reservations/filter', getReservations);
router.post('/reservations', auth, createReservation);
router.post('/reservations/:id', adminIdentity, updateReservation);
router.delete('/reservations/:id/cancel', auth, cancelReservation);

module.exports = router;
