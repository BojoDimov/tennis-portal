const moment = require('moment-timezone');
const router = require('express').Router();
const auth = require('./infrastructure/middlewares/auth');

const {
  Users,
  Seasons,
  Courts,
  Subscriptions,
  Reservations,
  ReservationPayments,
} = require('./db');
const Op = require('./db').Sequelize.Op;

const { StatisticsType } = require('./infrastructure/enums');

const collect = async (req, res, next) => {
  const filter = req.body;
  const date = moment(filter.date)

  const options = {
    include: [
      'subscription',
      'payments',
      'court',
      { model: Users, as: 'customer', attributes: ['id', 'email', 'name'] },
    ],
    where: {
      date: {
        [Op.between]: [
          moment(date).startOf('month').format('YYYY-MM-DD'),
          moment(date).endOf('month').format('YYYY-MM-DD')
        ]
      }
    }
  };

  if (filter.type == StatisticsType.DAILY)
    options.where.date = {
      [Op.eq]: filter.date
    }

  const results = await Reservations.findAll(options);
  return res.json(results);
}

// router.post('/', auth, collect);
router.post('/', collect);

module.exports = router;