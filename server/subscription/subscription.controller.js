const router = require('express').Router();
const SubscriptionService = require('./subscription.service');

const current = (_, res, _) => {
  return SubscriptionService
    .getCurrentSubs()
    .then(e => res.json(e));
}

const history = (_, res, _) => {
  return SubscriptionService
    .getHistorySubs()
    .then(e => res.json(e));
}

const create = (req, res, next) => {
  return SubscriptionService
    .createSubscription(req.body)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const update = (req, res, next) => {
  return SubscriptionService
    .updateSubscription(req.params.id, req.body)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return SubscriptionService
    .removeSubscription(req.params.id)
    .then(_ => res.json(null))
    .catch(err => next(err, req, res, null));
}

router.get('/', current);
router.get('/history', history);
router.update('/:id', update);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;