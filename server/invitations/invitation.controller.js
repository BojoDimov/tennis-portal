const router = require('express').Router();
const auth = require('../infrastructure/middlewares/auth');
const { Invitations, Users } = require('../db');

const getAll = async (req, res, next) => {
  const query = req.query || {};
  query.inviterId = req.user.id;

  const invitations = await Invitations.findAll({
    where: query,
    include: [
      { model: Users, as: 'inviter', attributes: ['id', 'name', 'email'] },
      { model: Users, as: 'invited', attributes: ['id', 'name', 'email'] }
    ]
  });

  return res.json(invitations);
}

const invite = async (req, res, next) => {
  const existing = await Invitations.findOne({
    where: {
      invitedId: req.body.invitedId,
      schemeId: req.body.schemeId,
      inviterId: req.user.id
    }
  });

  if (existing)
    return next({ name: 'DomainActionError' }, req, res, null);
  await Invitations.create(req.body);
  return res.json({});
}

const accept = async (req, res, next) => {

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