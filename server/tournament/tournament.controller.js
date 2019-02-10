const express = require('express');
const router = express.Router();
const TournamentsService = require('./tournament.service');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

const filter = async (req, res, next) => {
  try {
    const items = await TournamentsService.filter(req.body);
    return res.json(items);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const get = async (req, res, next) => {
  try {
    const item = await TournamentsService.get(req.params.id);
    return res.json(item);
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const create = async (req, res, next) => {
  try {
    await TournamentsService.create(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const update = async (req, res, next) => {
  try {
    await TournamentsService.get(req.params.id, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  try {
    await TournamentsService.get(req.params.id);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/filter', filter);
router.post('/', adminIdentity, create);
router.get('/:id', get);
router.post('/:id', adminIdentity, update);
router.delete('/:id', adminIdentity, remove);

module.exports = router;