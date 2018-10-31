const moment = require('moment');
const {
  Reservations,
  ReservationPayments,
  Seasons,
  Courts,
  Subscriptions,
  Users,
  sequelize,
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
    return await sequelize.transaction(async trn => {
      const existing = await Reservations.findAll({
        where: {
          courtId: model.courtId,
          hour: model.hour,
          date: {
            [Op.gte]: model.season.seasonStart,
            [Op.lte]: model.season.seasonEnd
          }
        }
      });

      if (existing.length > 0)
        throw { name: 'DomainActionError', error: existing };

      const reservations = this.generateReservations(model);
      const subscription = await Subscriptions.create(model, { transaction: trn });
      await Reservations.bulkCreate(reservations, { transaction: trn });
      return subscription;
    });
  }

  async updateSubscription(id, model) {
    // const subscription = await Subscriptions.findById(id);
    // if (!subscription)
    //   throw { name: 'NotFound' };

    // return await subscription.update(model);
    throw { name: 'NotImplemented' };
  }

  async removeSubscription(id) {
    return await sequelize.transaction(async (trn) => {
      const subscription = await Subscriptions.findById(id, { include: ['season'] });
      if (!subscription)
        throw { name: 'NotFound' };

      const reservations = await Reservations.findAll({
        where: {
          courtId: subscription.courtId,
          hour: subscription.hour,
          date: {
            [Op.gte]: subscription.season.seasonStart,
            [Op.lte]: subscription.season.seasonEnd
          }
        },
        include: ['payments']
      });

      const payments = reservations.reduce((acc, curr) => acc.concat(curr.payments), []);
      await ReservationPayments.destroy({ where: { id: payments.map(p => p.id) } });
      await Reservations.destroy({ where: { id: reservations.map(r => r.id) } });
      await Subscriptions.destroy({ where: { id: subscription.id } });
    });
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

  generateReservations(subscription) {
    const dates = getDateRange(moment(subscription.season.seasonStart), moment(subscription.season.seasonEnd));
    return dates.map(date => {
      return {
        userId: subscription.userId,
        seasonId: subscription.seasonId,
        courtId: subscription.courtId,
        hour: subscription.hour,
        date: date,
        type: ReservationType.SUBSCRIPTION
      }
    });
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

function getDateRange(startDate, endDate) {
  const result = [];
  var current = startDate
  while (current <= endDate) {
    result.push(current.format('YYYY-MM-DD'));
    current.add(1, 'days');
  }
  return result;
}

module.exports = new SubscriptionService();