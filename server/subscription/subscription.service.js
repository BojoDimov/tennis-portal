const {
  Reservations,
  Seasons,
  Courts,
  Subscriptions,
  Users,
  sequelize
} = require('../db');
const Op = sequelize.Op;

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
      include: this.includeAll()
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
      include: this.includeAll()
    });
  }

  async createSubscription(model) {
    return await Subscriptions.create(model);
  }

  async updateSubscription(id, model) {
    const subscription = await Subscriptions.findById(id);
    if (!subscription)
      throw { name: 'NotFound' };

    return await subscription.update(model);
  }

  async addUnplayedHour(id) {
    const subscription = await Subscriptions.findById(id);
    if (!subscription)
      throw { name: 'NotFound' };

    return await subscription.update({ unplayedHours: subscription.unplayedHours + 1 });
  }

  async useUnplayedHour(id) {
    const subscription = await Subscriptions.findById(id);
    if (!subscription)
      throw { name: 'NotFound' };

    return await subscription.update({ unplayedHours: subscription.unplayedHours - 1 });
  }

  async removeSubscription(id) {
    return await Subscriptions.destroy({ where: { id: id } });
  }

  includeAll() {
    return [
      {
        model: Subscriptions,
        as: 'subscriptions',
        include: [
          { model: Users, as: 'user', attributes: ['id', 'name', 'email', 'telephone'] },
          { model: Courts, as: 'court' }
        ]
      }
    ]
  }
}

module.exports = new SubscriptionService();