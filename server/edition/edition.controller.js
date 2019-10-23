const express = require('express');
const router = express.Router();
const EditionsService = require('./edition.service');
const identity = require('../infrastructure/middlewares/identity');

const filter = async (req, res, next) => {
  try {
    let includeDrafts = req.user && (req.user.isAdmin || req.user.isTournamentAdmin);
    const items = await EditionsService.filter(includeDrafts, req.query);
    return res.json(items);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const get = async (req, res, next) => {
  try {
    let includeDrafts = req.user && (req.user.isAdmin || req.user.isTournamentAdmin);
    const item = await EditionsService.get(req.params.id, includeDrafts);
    return res.json(item);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const create = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await EditionsService.create(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await EditionsService.update(req.params.id, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await EditionsService.remove(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/filter', identity, filter);
router.get('/:id', identity, get);
router.post('/:id', identity, update);
router.post('/', identity, create);
router.delete('/:id', identity, remove);

module.exports = router;