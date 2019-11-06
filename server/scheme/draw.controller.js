const express = require('express');
const router = express.Router();
const identity = require('../infrastructure/middlewares/identity');
const SchemeService = require('./scheme.service');

const drawGroupPhase = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await SchemeService.drawGroupPhase(req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const drawEliminationPhase = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    //await SchemeService.drawEliminationPhase(req.scheme, req.body.teams);
    //Reverted to old functionality because client wanted it.
    await SchemeService.drawElimination_old_but_working(req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const previewEliminationPhase = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    let teams = await SchemeService.previewEliminationPhase(req.scheme);
    return res.json(teams);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const finishPhase = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await SchemeService.finishPhase(req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.get('/groupPhase', identity, drawGroupPhase);
router.get('/eliminationPhase/preview', identity, previewEliminationPhase);
router.get('/eliminationPhase', identity, drawEliminationPhase);
router.get('/finish', identity, finishPhase);

module.exports = router;