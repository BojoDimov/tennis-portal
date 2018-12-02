const router = require('express').Router();
const {
  Users,
  Subscriptions,
  Tournaments,
  Sequelize
} = require('./db');
const Op = Sequelize.Op;

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
    options.where.usedHours = {
      [Op.lt]: Sequelize.col('totalHours')
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

router.post('/users', selectUsers);
router.post('/subscriptions', selectSubscriptions);
router.post('/tournaments', selectTournament);

module.exports = router;