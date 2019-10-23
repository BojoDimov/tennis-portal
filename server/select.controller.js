const router = require('express').Router();
const {
  Users,
  Teams,
  Subscriptions,
  Tournaments,
  Groups,
  GroupTeams,
  Enrollments,
  Seasons,
  Sequelize
} = require('./db');
const Op = Sequelize.Op;

const auth = require('./infrastructure/middlewares/auth');
const admin = require('./infrastructure/middlewares/adminIdentity');

const selectUsers = async (request, response) => {
  const filter = request.body;
  const query = request.query;

  const options = {
    include: [],
    order: [['name', 'asc']],
    attributes: ['id', 'name', 'email'],
    limit: filter.limit,
    offset: filter.offset
  };

  if (filter.searchTerm)
    options.where = {
      [Op.or]: {
        name: {
          [Op.iLike]: '%' + filter.searchTerm + '%'
        },
        email: {
          [Op.iLike]: '%' + filter.searchTerm + '%'
        }
      }
    };

  if (query.seasonId) {
    options.include.push({
      model: Subscriptions,
      as: 'subscriptions',
      where: {
        seasonId: query.seasonId
      }
    });

    options.order.push(
      [{ model: Subscriptions, as: 'subscriptions' }, 'createdAt', 'desc']
    );
  }

  const result = await Users.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

const selectTeams = async (request, response) => {
  const filter = request.body;
  const options = {
    include: [
      { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
      { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
    ]
  }

  if (filter.groupId)
    options.include.push({
      model: GroupTeams,
      as: 'groupTeams',
      where: {
        groupId: filter.groupId
      }
    });

  if (filter.singleTeams)
    options.where = {
      user2Id: null
    };
  else
    options.where = {
      [Op.not]: {
        user2Id: null
      }
    };

  const result = await Teams.findAndCountAll(options);
  return response.json({
    totalCount: result.count,
    options: result.rows
  })
}

const selectSubscriptions = async (request, response) => {
  const filter = request.body;
  const options = {
    where: {},
    include: ['season'],
    order: [['createdAt', 'desc']]
  };

  if (filter.userId)
    options.where.customerId = filter.userId;

  if (filter.seasonId)
    options.where.seasonId = filter.seasonId;

  if (filter.type)
    options.where.type = filter.type;

  if (filter.onlyAvailable)
    options.where.remainingHours = {
      [Op.gte]: 0
    };

  const result = await Subscriptions.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

const selectTournament = async (request, response) => {
  const options = {
    where: {},
    order: [['createdAt', 'desc']]
  };

  const result = await Tournaments.findAndCountAll(options);
  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

const selectInvited = async (request, response) => {
  const filter = request.body;
  const schemeEnrollments = await Enrollments.findAll({
    where: {
      schemeId: request.body.schemeId
    },
    include: ['team']
  });

  const userIds = schemeEnrollments
    .reduce((acc, { team }) => acc.concat([team.user1Id, team.user2Id]), [])
    .filter(id => id);

  if (filter.userId)
    userIds.push(filter.userId);

  const result = await Users.findAndCountAll({
    where: {
      id: {
        [Op.notIn]: userIds
      }
    },
    order: [['name', 'asc']]
  });

  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

const selectSeasons = async (request, response) => {
  const filter = request.body;
  const query = request.query;

  const options = {
    include: [],
    order: [['seasonStart', 'desc']],
    limit: filter.limit,
    offset: filter.offset
  };

  if (filter.searchTerm)
    options.where = {
      name: {
        [Op.iLike]: '%' + filter.searchTerm + '%'
      }
    };

  const result = await Seasons.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

router.post('/users', selectUsers);
router.post('/teams', selectTeams);
router.post('/subscriptions', selectSubscriptions);
router.post('/tournaments', selectTournament);
router.post('/invitable', auth, selectInvited);
router.post('/seasons', admin, selectSeasons);

module.exports = router;