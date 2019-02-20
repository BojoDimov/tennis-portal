const router = require('express').Router();
const auth = require('../infrastructure/middlewares/auth');
const identity = require('../infrastructure/middlewares/identity');
const UserService = require('./user.service');
const EmailService = require('../emails/email.service');
const SubscriptionService = require('../subscription/subscription.service');
const ScheduleService = require('../schedule/schedule.service');
const EnrollmentsService = require('../enrollment/enrollment.service');

const getAll = (req, res, next) => {
  return UserService
    .getAll()
    .then(e => res.json(e));
}

const getEnrollments = async (req, res) => {
  if (!req.user)
    return res.json({});

  const enrollments = await EnrollmentsService.getByUserId(req.user.id);
  const result = [];
  enrollments.forEach(e => result[e.schemeId] = e);
  return res.json(result);
}

const create = async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);

    //sink in email service errors
    try {
      await EmailService.createRegistrationEmail(user);
    }
    catch (err) { }

    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = (req, res, next) => {
  return UserService
    .update(req.params.id, req.body)
    .then(_ => res.json({}))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return UserService
    .delete(req.params.id)
    .then(_ => res.json({}))
    .catch(err => next(err, req, res, null));
}

const activate = async (req, res, next) => {
  try {
    await UserService.activateUser(req.query.token);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const issueRecoveryEmail = async (req, res, next) => {
  const user = await UserService.getByEmail(req.query.email);
  if (!user)
    return next({
      name: 'DomainActionError',
      error: { message: 'Невалиден имейл.' }
    }, req, res, null);

  try {
    await EmailService.createRecoveryEmail(user);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const recoverAccount = async (req, res, next) => {
  try {
    await UserService.recoverPassword(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const collect = async (req, res) => {
  const identity = req.user;
  const userId = req.params.id;
  let user = await UserService.getById(userId),
    reservations,
    subscriptions;

  if (identity && (identity.id == userId || identity.isAdmin)) {
    subscriptions = await SubscriptionService.getByUserId(userId);
    reservations = await ScheduleService.getReservationsByUserId(userId);
  }

  return res.json({
    user, reservations, subscriptions
  });
}

const updateSecondaryData = async (req, res, next) => {
  try {
    const user = req.user;
    await UserService.updateSecondaryData(user, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const changePassword = async (req, res, next) => {
  try {
    await UserService.changePassword(req.user.id, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.get('/enrollments', identity, getEnrollments);
router.get('/activation', activate);
router.get('/recovery/step1', issueRecoveryEmail);
router.get('/:id', auth, collect);
router.get('/', auth, getAll);
router.post('/recovery/step2', recoverAccount);
router.post('/updateSecondaryData', auth, updateSecondaryData);
router.post('/changePassword', auth, changePassword);
router.post('/:id', auth, update);
router.post('/', create);
router.delete('/:id', auth, remove);

module.exports = router;