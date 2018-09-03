const express = require('express');
const router = express.Router();

const { sequelize } = require('../db');
const {
  Users,
  UserDetails,
  UserActivationCodes,
  Teams,
  Invitations
} = require('../models');
const { Op } = require('../db').Sequelize;

const getAll = (req, res) => {
  return Users
    .findAll({
      attributes: ['id', 'name', 'birthDate', 'email', 'gender', 'isActive', 'isAdmin', 'telephone'],
      order: [['id']]
    })
    .then(e => res.json(e));
}

const get = (req, res) => {
  return Users
    .findById(req.params.id, { attributes: ['id', 'name', 'birthDate', 'email', 'gender', 'isActive', 'isAdmin', 'telephone'] })
    .then(e => res.json(e));
}

const update = (req, res, next) => {
  return Users
    .findById(req.params.id, { attributes: ['id', 'name', 'birthDate', 'email', 'gender', 'isActive', 'isAdmin', 'telephone'] })
    .then(e => e.update(req.body))
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const remove = (req, res, next) => {
  return sequelize
    .transaction(function (trn) {
      return Promise
        .all([
          UserDetails.destroy({ where: { userId: req.params.id }, transaction: trn }),
          Teams.destroy({ where: { user1Id: req.params.id }, transaction: trn }),
          UserActivationCodes.destroy({ where: { userId: req.params.id }, transaction: trn }),
          Invitations.destroy({
            where: {
              [Op.or]: {
                inviterId: req.params.id,
                invitedId: req.params.id
              }
            }
          })
        ])
        .then(() => Users.destroy({ where: { id: req.params.id }, transaction: trn }))
    })
    .then(() => res.json({}))
    .catch(err => next(err, req, res, null));
}

router.get('/', getAll);
router.get('/:id', get);
router.post('/:id', update);
router.post('/:id/remove', remove);

module.exports = router;