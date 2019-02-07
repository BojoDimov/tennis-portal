const express = require('express');
const router = express.Router();
const GroupsService = require('./group.service');

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

router.post('/', create);
router.post('/:groupId', update);
module.exports = router;