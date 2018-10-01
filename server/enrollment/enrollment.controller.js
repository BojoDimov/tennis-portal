const express = require('express');
const router = express.Router();

const EnrollmentsService = require('./enrollment.service');

const getAll = (req, res, next) => {
  return EnrollmentsService
    .getAll(req.scheme)
    .then(e => res.json(e));
}

const create = (req, res, next) => {
  return EnrollmentsService
    .enroll(req.body)
    .then(e => res.json(e));
}

const remove = (req, res, next) => {
  return EnrollmentsService
    .cancelEnroll(req.params.id)
    .then(e => res.json(e));
}

router.get('/', getAll);
router.post('/', create);
router.delete('/:id', remove);
module.exports = router;