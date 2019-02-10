const express = require('express');
const router = express.Router();
const GroupsService = require('./group.service');
const adminIdentity = require('../infrastructure/middlewares/adminIdentity');

const create = async (req, res, next) => {
  try {
    await GroupsService.create(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
};

const update = async (req, res, next) => {
  try {
    await GroupsService.update(req.params.groupId, req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

const remove = async (req, res, next) => {
  try {
    await GroupsService.delete(req.params.groupId, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/', adminIdentity, create);
router.post('/:groupId', adminIdentity, update);
router.delete('/:groupId', adminIdentity, remove);
module.exports = router;