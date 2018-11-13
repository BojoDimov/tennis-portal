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

  async create(model) {
    return await Subscriptions.create(model);
  }

  async update(subscription, model) {
    return await subscription.update(model);
  }

  async remove(id) {
    return await Subscriptions.destroy({ where: { id } });
  }

  // async removeSubscription(id) {
  //   return await sequelize.transaction(async (trn) => {
  //     const subscription = await Subscriptions.findById(id, {
  //       include: [
  //         'season',
  //         {
  //           model: Reservations,
  //           as: 'reservations',
  //           include: ['payments']
  //         }
  //       ]
  //     });

  //     if (!subscription)
  //       throw { name: 'NotFound' };

  //     const payments = subscription.reservations.reduce((acc, curr) => acc.concat(curr.payments), []);
  //     await ReservationPayments.destroy({ where: { id: payments.map(p => p.id) } });
  //     await Reservations.destroy({ where: { id: subscription.reservations.map(r => r.id) } });
  //     await Subscriptions.destroy({ where: { id: subscription.id } });
  //   });
  // }

  // async addUnplayedHour(id, transaction) {
  //   const subscription = await Subscriptions.findById(id);
  //   if (!subscription)
  //     throw { name: 'NotFound' };

  //   return await subscription.update({ unplayedHours: subscription.unplayedHours + 1 });
  // }

  // async useUnplayedHour(id) {
  //   const subscription = await Subscriptions.findById(id);
  //   if (!subscription)
  //     throw { name: 'NotFound' };

  //   return await subscription.update({ unplayedHours: subscription.unplayedHours - 1 });
  // }

  // generateReservations(subscription) {
  //   const dates = getDateRange(moment(subscription.season.seasonStart), moment(subscription.season.seasonEnd));
  //   return dates.map(date => {
  //     return {
  //       userId: subscription.userId,
  //       seasonId: subscription.seasonId,
  //       courtId: subscription.courtId,
  //       hour: subscription.hour,
  //       date: date,
  //       type: ReservationType.SUBSCRIPTION
  //     }
  //   });
  // }

  includeSubs() {
    return [
      {
        model: Subscriptions,
        as: 'subscriptions',
        include: [
          { model: Users, as: 'administrator', attributes: ['id', 'name', 'email', 'telephone'] },
          { model: Users, as: 'customer', attributes: ['id', 'name', 'email', 'telephone'] }
        ]
      }
    ]
  }
}

// function getDateRange(startDate, endDate) {
//   const result = [];
//   var current = startDate
//   while (current <= endDate) {
//     result.push(current.format('YYYY-MM-DD'));
//     current.add(1, 'days');
//   }
//   return result;
// }

module.exports = new SubscriptionService();