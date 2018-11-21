const express = require('express');
const router = express.Router();
const SchemeService = require('./scheme.service');

const filter = async (req, res, next) => {
  try {
    const items = await SchemeService.filter(req.body);
    return res.json(items);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

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
    await SchemeService.get(req.params.id, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  try {
    await SchemeService.get(req.params.id);
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

router.post('/filter', filter);
router.post('/', create);
router.get('/:id', get);
router.post('/:id', update);
router.delete('/:id', remove);

// router.get('/', getAll);
// router.get('/:id', get);
// router.use('/:id/enrollments', includeScheme, require('../enrollment/enrollment.controller'));
// router.use('/:id/matches', includeScheme, require('../match/match.controller'));

module.exports = router;