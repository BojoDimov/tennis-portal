const router = require('express').Router();
const ScheduleService = require('./schedule.service');
const auth = require('../infrastructure/middlewares/auth');
const identity = require('../infrastructure/middlewares/identity');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

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

  try {
    const reservation = await ScheduleService.updateReservation(req.params.id, model);
    return res.json(reservation);
  }
  catch (e) {
    return next(e, req, res, next);
  }
}

const cancelReservation = (req, res, next) => {
  return ScheduleService
    .cancelReservation(req.params.id, req.user.id)
    .then(_ => res.json(null));
}

const deleteReservation = (req, res, next) => {
  return ScheduleService
    .deleteReservation(req.params.id)
    .then(_ => res.json({}));
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
router.delete('/reservations/:id/cancel', identity, cancelReservation);
router.delete('/reservations/:id', adminIdentity, deleteReservation);

module.exports = router;
