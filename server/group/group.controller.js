const express = require('express');
const router = express.Router();
const GroupsService = require('./group.service');
const identity = require('../infrastructure/middlewares/identity');

const create = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await GroupsService.create(req.body);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
};

const update = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isTournamentAdmin))
    return next({ name: 'DomainActionError', error: 'notEnoughPermissions' }, req, res, null);

  try {
    await GroupsService.update(req.params.groupId, req.body);
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
    await GroupsService.delete(req.params.groupId, req.scheme);
    return res.json({});
  }
  catch (err) {
    return next(err, req, res, null);
  }
}

router.post('/', identity, create);
router.post('/:groupId', identity, update);
router.delete('/:groupId', identity, remove);
module.exports = router;