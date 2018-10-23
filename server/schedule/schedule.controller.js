const router = require('express').Router();
const ScheduleService = require('./schedule.service');
const identity = require('../infrastructure/middlewares/identity');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

const collect = (req, res, next) => {
  return Promise
    .all([ScheduleService.getSeasons(), ScheduleService.getCourts()])
    .then(([seasons, courts]) => res.json({ seasons, courts }));
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
  model.userId = (req.user || { id: null }).id;

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
  model.userId = req.user.id;

  try {
    const reservation = await ScheduleService.updateReservation(req.params.id, req.body);
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
router.get('/admin', collect);

router.post('/seasons', createSeason);
router.post('/seasons/:id', updateSeason);

router.post('/courts', createCourt);
router.post('/courts/:id', updateCourt);

router.post('/reservations/filter', getReservations);
router.post('/reservations', identity, createReservation);
router.post('/reservations/:id', adminIdentity, updateReservation);
router.delete('/reservations/:id/cancel', identity, cancelReservation);
router.delete('/reservations/:id', adminIdentity, deleteReservation);

module.exports = router;
