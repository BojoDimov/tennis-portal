const express = require('express');
const router = express.Router();
const TeamsService = require('./team.service');

const getAll = (req, res) => {
  return TeamsService
    .getAll()
    .then(e => res.json(e));
}

router.get('/', getAll);
module.exports = router;