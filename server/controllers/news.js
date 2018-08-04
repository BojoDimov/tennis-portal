const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { News } = require('../models');

const filter = (req, res, next) => {
  req.query.parentId = null;

  return News
    .findAll({
      where: req.query
    })
    .then(e => res.json(e));
}

const getFeatured = (req, res, next) => {
  return News
    .findAll({
      where: {
        parentId: null
      },
      order: [
        ['createdAt', 'desc']
      ],
      limit: 2
    })
    .then(e => res.json(e));
}

const get = (req, res, next) => {
  return News
    .findOne({
      where: {
        id: req.params.id,
        parentId: null
      },
      include: [{ model: News, as: 'subsections' }]
    })
    .then(e => res.json(e));
}

const create = (req, res, next) => {

}

const update = (req, res, next) => {

}

router.get('/', filter);
router.get('/featured', getFeatured);
router.get('/:id', get);
router.post('/', auth, create);
router.post('/:id', auth, update);

module.exports = router;