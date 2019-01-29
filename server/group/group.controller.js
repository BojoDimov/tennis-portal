const express = require('express');
const router = express.Router();
const GroupsService = require('./group.service');

const create = (req, res) => null;

const update = async (req, res, next) => {

}

router.post('/', create);
router.post('/:id', update);
module.exports = router;