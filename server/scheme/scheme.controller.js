const express = require('express');
const router = express.Router();
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');
const identity = require('../infrastructure/middlewares/identity');
const SchemeService = require('./scheme.service');

const get = async (req, res, next) => {
  try {
    const item = await SchemeService.get(req.params.id);
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
    await SchemeService.create(req.body);
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
    const scheme = await SchemeService.get(req.params.id);
    await SchemeService.update(scheme, req.body);
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
    await SchemeService.delete(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const include = async (req, res, next) => {
  try {
    req.scheme = await SchemeService.get(req.params.id);
    return next();
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const getScore = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    const rankings = await SchemeService.getScore(req.scheme);
    return res.json(rankings);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const saveScore = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await SchemeService.saveScore(req.scheme, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.use('/:id/draw', include, require('./draw.controller'));
router.use('/:id/enrollments', include, require('../enrollment/enrollment.controller'));
router.use('/:id/matches', include, require('../match/match.controller'));
router.use('/:id/groups', include, require('../group/group.controller'));
router.get('/:id/scores', identity, include, getScore);
router.post('/:id/scores/save', identity, include, saveScore);
router.get('/:id', get);
router.post('/:id', identity, update);
router.post('/', identity, create);
router.delete('/:id', identity, remove);

module.exports = router;