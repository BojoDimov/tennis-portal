const moment = require('moment');
const {
  Seasons,
  Subscriptions,
  Users,
  Sequelize
} = require('../db');
const Op = Sequelize.Op;
const { ReservationType } = require('../infrastructure/enums');

class SubscriptionService {
  async getCurrentSubs() {
    let today = new Date();
    return await Seasons.findOne({
      where: {
        seasonStart: {
          [Op.lte]: today
        },
        seasonEnd: {
          [Op.gte]: today
        }
      },
      include: this.includeSubs()
    });
  }

  async getHistorySubs() {
    const today = new Date();
    return await Seasons.findAll({
      where: {
        seasonEnd: {
          [Op.lt]: today
        }
      },
      include: this.includeSubs()
    });
  }

  async get(id) {
    return await Subscriptions.findById(id, {
      include: [
        { model: Seasons, as: 'season' },
        { model: Users, as: 'administrator', attributes: ['id', 'name', 'email', 'telephone'] },
        { model: Users, as: 'customer', attributes: ['id', 'name', 'email', 'telephone'] }
      ]
    });
  }

  async getByUserId(userId) {
    return await Subscriptions.findAll({
      where: {
        customerId: userId
      },
      include: [
        { model: Seasons, as: 'season', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'desc']]
    });
  }

  async create(model) {
    return await Subscriptions.create(model);
  }

  async update(subscription, model) {
    return await subscription.update(model);
  }

  async remove(id) {
    return await Subscriptions.destroy({ where: { id } });
  }

  includeSubs() {
    return [
      {
        model: Subscriptions,
        as: 'subscriptions',
        include: [
          'season',
          { model: Users, as: 'administrator', attributes: ['id', 'name', 'email', 'telephone'] },
          { model: Users, as: 'customer', attributes: ['id', 'name', 'email', 'telephone'] }
        ]
      }
    ]
  }
}

module.exports = new SubscriptionService();