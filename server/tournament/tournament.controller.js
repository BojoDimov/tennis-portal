const express = require('express');
const router = express.Router();
const TournamentsService = require('./tournament.service');
const identity = require('../infrastructure/middlewares/identity');

const filter = async (req, res, next) => {
  try {
    let includeDrafts = req.user && (req.user.isAdmin || req.user.isTournamentAdmin);
    const items = await TournamentsService.filter(includeDrafts);
    return res.json(items);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const get = async (req, res, next) => {
  try {
    let includeDrafts = req.user && (req.user.isAdmin || req.user.isTournamentAdmin);
    const tournament = await TournamentsService.get(req.params.id, includeDrafts);
    return res.json(tournament);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const create = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await TournamentsService.create(req.body);
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
    await TournamentsService.update(req.params.id, req.body);
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
    await TournamentsService.remove(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/filter', identity, filter);
router.post('/', identity, create);
router.get('/:id', identity, get);
router.post('/:id', identity, update);
router.delete('/:id', identity, remove);

module.exports = router;