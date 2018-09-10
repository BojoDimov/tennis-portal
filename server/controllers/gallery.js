const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { Gallery } = require('../models');


const get = (req, res, next) => {
  return Gallery
    .findAll({
      where: {
        tournamentId: req.query.tournamentId
      },
      order: [['createdAt', 'desc']]
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const addImage = (req, res, next) => {
  return Gallery
    .create({
      tournamentId: req.body.tournamentId,
      imageId: req.body.imageId
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const removeImage = (req, res, next) => {
  return Gallery
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => res.json({}))
    .catch(err => next(err, req, res, null));
}

router.get('/:id/remove', auth, removeImage);
router.get('/', get);
router.post('/', auth, addImage);

module.exports = router;