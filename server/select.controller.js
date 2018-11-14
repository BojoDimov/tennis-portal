const router = require('express').Router();
const {
  Users,
  Courts,
  Subscriptions,
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

    // if (filter.season) {
    //   options.include.push({
    //     model: Subscriptions,
    //     as: 'subscriptions',
    //     where: {
    //       seasonId: filter.season.id
    //     },
    //     required: filter.season.required
    //   });

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

  const result = await Subscriptions.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    options: result.rows
  });
}

// const selectCourts = async (request, response) => {
//   const filter = request.body;
//   const options = {
//     order: [['id', 'asc']],
//     limit: filter.limit,
//     offset: filter.offset,
//     where: {
//       isActive: true
//     }
//   };

//   if (filter.searchTerm)
//     options.where = {
//       name: {
//         [Op.iLike]: '%' + filter.searchTerm + '%'
//       },
//       isActive: true
//     };

//   const result = await Courts.findAndCountAll(options);

//   return response.json({
//     totalCount: result.count,
//     items: result.rows.map(item => {
//       return {
//         value: item.id,
//         label: item.name
//       }
//     })
//   });
// }

// router.post('/courts', selectCourts);
router.post('/users', selectUsers);
router.post('/subscriptions', selectSubscriptions);

module.exports = router;