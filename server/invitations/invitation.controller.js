const router = require('express').Router();
const auth = require('../infrastructure/middlewares/auth');
const { Invitations, Users, sequelize, Schemes } = require('../db');
const Op = sequelize.Op;
const TeamsService = require('../team/team.service');
const EnrollmentsService = require('../enrollment/enrollment.service');

const getAll = async (req, res, next) => {
  const query = {
    [Op.or]: {
      inviterId: req.user.id,
      invitedId: req.user.id
    }
  }

  if (req.query.schemeId)
    query.schemeId = req.query.schemeId;

  const invitations = await Invitations.findAll({
    where: query,
    include: [
      { model: Users, as: 'inviter', attributes: ['id', 'name', 'email'] },
      { model: Users, as: 'invited', attributes: ['id', 'name', 'email'] },
      { model: Schemes, as: 'scheme', include: ['edition'] }
    ]
  });

  return res.json(invitations);
}

const invite = async (req, res, next) => {
  const invitation = {
    invitedId: req.body.invitedId,
    inviterId: req.user.id,
    schemeId: req.body.schemeId
  };

  const existing = await Invitations.findOne({
    where: invitation
  });

  if (existing)
    return next({ name: 'DomainActionError' }, req, res, null);
  await Invitations.create(invitation);
  return res.json({});
}

const accept = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const invitation = await Invitations.findOne({
      where: {
        id: req.params.id,
        invitedId: req.user.id
      },
      include: ['scheme', 'inviter', 'invited']
    });
    if (!invitation)
      throw { name: 'NotFound' };

    const team = await TeamsService.findOrCreate({
      user1: invitation.inviter,
      user2: invitation.invited
    }, transaction);

    const enrollmentData = {
      scheme: invitation.scheme,
      team: team,
      user1Id: team.user1Id,
      user2Id: team.user2Id,
      shouldValidate: true
    };

    await EnrollmentsService.enroll(enrollmentData, transaction);

    await transaction.commit();
    return res.json({});
  }
  catch (err) {
    await transaction.rollback();
    return next(err, req, res, null);
  }
}

const cancel = async (req, res, next) => {
  const invitation = await Invitations.findOne({
    where: {
      inviterId: req.user.id,
      id: req.params.id
    }
  });

  if (!invitation)
    return next({ name: 'NotFound' }, req, res, null);

  await Invitations.destroy({ where: { id: req.params.id } });
  return res.json({});
}

router.get('/', auth, getAll);
router.post('/:id', auth, accept);
router.post('/', auth, invite);
router.delete('/:id', auth, cancel);
module.exports = router;