const express = require('express');
const router = express.Router();
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');
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
  try {
    await SchemeService.create(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = async (req, res, next) => {
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

const drawBracket = async (req, res, next) => {
  try {
    await SchemeService.drawBracket(req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/', adminIdentity, create);
router.get('/:id', get);
router.post('/:id', adminIdentity, update);
router.delete('/:id', adminIdentity, remove);
router.get('/:id/drawBracket', adminIdentity, include, drawBracket);
router.use('/:id/enrollments', include, require('../enrollment/enrollment.controller'));
router.use('/:id/matches', include, require('../match/match.controller'));
router.use('/:id/groups', include, require('../group/group.controller'));

module.exports = router;