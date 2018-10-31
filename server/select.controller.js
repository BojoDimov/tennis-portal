const router = require('express').Router();
const {
  Users,
  Courts,
  Sequelize
} = require('./db');
const Op = Sequelize.Op;

const selectUsers = async (request, response) => {
  const filter = request.body;
  const options = {
    order: [['name', 'asc']],
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

  const result = await Users.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    items: result.rows.map(item => {
      return {
        value: item.id,
        label: `${item.name} (${item.email})`
      }
    })
  });
}

const selectCourts = async (request, response) => {
  const filter = request.body;
  const options = {
    order: [['id', 'asc']],
    limit: filter.limit,
    offset: filter.offset,
    where: {
      isActive: true
    }
  };

  if (filter.searchTerm)
    options.where = {
      name: {
        [Op.iLike]: '%' + filter.searchTerm + '%'
      },
      isActive: true
    };

  const result = await Courts.findAndCountAll(options);

  return response.json({
    totalCount: result.count,
    items: result.rows.map(item => {
      return {
        value: item.id,
        label: item.name
      }
    })
  });
}

router.post('/courts', selectCourts);
router.post('/users', selectUsers);

module.exports = router;