const express = require('express');
const router = express.Router();
const TeamsService = require('./team.service');

// const get = async (req, res, next) => {
//   try {
//     const team = await TeamsService.get(req.params.id);
//     return res.json(team);
//   }
//   catch (err) {
//     return next(err, req, res, null);
//   }
// }

//router.get('/:id', get);
module.exports = router;