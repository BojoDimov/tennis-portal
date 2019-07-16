const router = require('express').Router();
const SubscriptionService = require('./subscription.service');

// const current = (_, res) => {
//   return SubscriptionService
//     .getCurrentSubs()
//     .then(e => res.json(e));
// }

// const history = (_, res) => {
//   return SubscriptionService
//     .getHistorySubs()
//     .then(e => res.json(e));
// }

const create = (req, res, next) => {
  const model = req.body;
  model.administrator = req.user;
  model.administratorId = req.user.id;

  return SubscriptionService
    .create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const update = async (req, res, next) => {
  const model = req.body;
  model.administrator = req.user;
  model.administratorId = req.user.id;
  const subscription = await SubscriptionService.get(req.params.id);
  if (!subscription)
    next({ name: 'NotFound' }, req, res, null);

  try {
    const updated = await SubscriptionService.update(subscription, model);
    return res.json(updated);
  }
  catch (err) {
    next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  const subscription = await SubscriptionService.get(req.params.id);
  if (!subscription)
    next({ name: 'NotFound' }, req, res, null);

  try {
    await SubscriptionService.remove(req.params.id);
    return res.json({});
  }
  catch (err) {
    next(err, req, res, null);
  }
}

// router.get('/', current);
// router.get('/history', history);
router.post('/:id', update);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;