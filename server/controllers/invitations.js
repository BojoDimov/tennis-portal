const express = require('express');
const router = express.Router();

const { TournamentEditions, TournamentSchemes, Users, Invitations, Teams, Enrollments } = require('../models');
const db = require('../db');
const Op = db.Sequelize.Op;

function _getAvailable(req, res, err) {
  let availableGenders = [];

  return TournamentSchemes
    .findById(req.body.schemeId)
    .then(scheme => {
      if (!scheme || scheme.singleTeams)
        err({ name: 'DomainActionError', message: 'Invalid scheme' }, req, res, null);

      if (scheme.mixedTeams && req.user.gender == 'male')
        availableGenders.push('female');
      if (scheme.mixedTeams && req.user.gender == 'female')
        availableGenders.push('male');
      if (scheme.maleTeams)
        availableGenders.push('male');
      if (scheme.femaleTeams)
        availableGenders.push('female');

      return Users
        .findAll({
          where: {
            id: {
              [Op.not]: req.user.id
            },
            gender: availableGenders,
            name: {
              [Op.iLike]: '%' + (req.body.searchTerm ? req.body.searchTerm : '') + '%'
            }
          },
          attributes: ['id', 'name', 'gender', 'birthDate']
        });
    });
}

const getAvailable = (req, res, next) => {
  return Promise
    .all([
      _getAvailable(req, res, next),
      _getInvited(req),
      _getInvitations(req)
    ])
    .then(([available, invited, invitations]) => {
      return available.map(user => {
        return {
          id: user.id,
          name: user.name,
          birthDate: user.birthDate,
          gender: user.gender,
          canInvite: !invited.find(e => e.invitedId == user.id) && !invitations.find(e => e.inviterId == user.id),
          canRevoke: invited.find(e => e.invitedId == user.id) != null,
          canAccept: invitations.find(e => e.inviterId == user.id) != null
        }
      });
    })
    .then(e => res.json(e));
}

const enrollmentsGuard = (req, res, next) => {
  let isEnrolled = Enrollments
    .get(req.body.schemeId)
    .then(enrollments => {
      if (enrollments.find(e => e.user1Id == req.user.id || e.user2Id == req.user.id))
        return true;
      else return false;
    });

  let isInQueue = Enrollments
    .getQueue(req.body.schemeId)
    .then(enrollments => {
      if (enrollments.find(e => e.user1Id == req.user.id || e.user2Id == req.user.id))
        return true;
      else return false;
    });

  return Promise
    .all([isEnrolled, isInQueue])
    .then(([flag1, flag2]) => {
      if (flag1 || flag2)
        next({ name: 'DomainActionError', message: 'Вече сте записан в този турнир' }, req, res, null);
      else next();
    });
}

function _getInvitations(req) {
  return Invitations
    .findAll({
      where: {
        invitedId: req.user.id
      },
      include: [
        {
          model: TournamentSchemes,
          as: 'scheme',
          attributes: ['id', 'name'],
          include: [
            {
              model: TournamentEditions, attributes: ['id', 'name']
            }
          ]
        },
        { model: Users, as: 'inviter', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'desc']]
    });
}

const getInvitations = (req, res, next) => {
  return _getInvitations(req)
    .then(e => res.json(e));
}

function _getInvited(req) {
  return Invitations
    .findAll({
      where: {
        inviterId: req.user.id
      }
    })
}

const getInvited = (req, res, next) => {
  return _getInvited(req)
    .then(e => res.json(e));
}

const invite = (req, res, next) => {
  return Invitations
    .create({
      schemeId: req.query.schemeId,
      inviterId: req.user.id,
      invitedId: req.query.userId
    })
    .then(() => res.json({}));
}

const acceptInvitation = (req, res, next) => {
  return db.sequelize
    .transaction(function (trn) {
      return Invitations
        .findOne({
          where: {
            inviterId: req.query.userId,
            invitedId: req.user.id,
            schemeId: req.query.schemeId
          }
        })
        .then(invitation => Teams.create({
          user1Id: invitation.inviterId,
          user2Id: invitation.invitedId
        }, { transaction: trn }))
        .then(team => TournamentSchemes.enroll(req.query.schemeId, team, trn))
        .then(() => Invitations.destroy({
          where: {
            inviterId: req.query.userId,
            invitedId: req.user.id,
            schemeId: req.query.schemeId
          },
          transaction: trn
        }))
    })
    .then(() => res.json({}));
}

const revokeInvitation = (req, res, next) => {
  return Invitations
    .destroy({
      where: {
        inviterId: req.user.id,
        invitedId: req.query.userId,
        schemeId: req.query.schemeId
      }
    })
    .then(() => res.json({}));
}


/**
const body = {
  "searchTerm": "",
  "schemeId": 0
};
*/
router.post('/available', enrollmentsGuard, getAvailable);
router.get('/', getInvitations);
router.get('/invited', getInvited);
router.get('/invite', invite);
router.get('/accept', acceptInvitation);
router.get('/revoke', revokeInvitation);

module.exports = router;