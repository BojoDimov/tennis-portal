const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { News } = require('../models');
const { sequelize } = require('../db');

const filter = (req, res, next) => {
  req.query.parentId = null;

  return News
    .findAll({
      where: req.query,
      order: [
        ['createdAt', 'desc']
      ]
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

function _get(req) {
  return News
    .findOne({
      where: {
        id: req.params.id,
        parentId: null
      },
      include: [{ model: News, as: 'subsections' }],
      order: [['subsections', 'order', 'asc']]
    });
}

const get = (req, res, next) => {
  return _get(req)
    .then(e => res.json(e));
}

const create = (req, res, next) => {
  return News
    .create(req.body, { include: 'subsections' })
    .then(e => res.json(e));
}

const update = (req, res, next) => {

  return sequelize
    .transaction(function (trn) {
      return News
        .findById(req.params.id, { include: [{ model: News, as: 'subsections' }] })
        .then(news => {
          let added = req.body.subsections.filter(e => !e.id);
          let changed = req.body.subsections.filter(e => e.id);
          let deleted = news.subsections.filter(e => !req.body.subsections.find(ss => ss.id == e.id)).map(e => e.id);

          return Promise.all([
            news.update(req.body, { transaction: trn }),
            News.destroy({ where: { id: deleted }, transaction: trn }),
            changed.map(e => news.subsections.find(ss => ss.id == e.id).update(e, { transaction: trn })),
            News.bulkCreate(added, { transaction: trn })
          ]);
        });
    })
    .then(e => res.json(e));
}

router.get('/', filter);
router.get('/featured', getFeatured);
router.get('/:id', get);
router.post('/', auth, create);
router.post('/:id', auth, update);

module.exports = router;