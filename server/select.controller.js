const router = require('express').Router();
const {
  Users,
  sequelize
} = require('./db');
const Op = sequelize.Op;

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

router.post('/users', selectUsers);

module.exports = router;