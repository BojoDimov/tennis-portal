const moment = require('moment');
const { ReservationType } = require('../infrastructure/enums');
const {
  Seasons,
  Courts,
  Reservations,
  ReservationPayments,
  Subscriptions,
  Users,
  sequelize,
  Sequelize
} = require('../db');
const Op = Sequelize.Op;
const SubscriptionService = require('../subscription/subscription.service');
class ScheduleService {
  getSeasons() {
    return Seasons.findAll();
  }

  getCourts(includeInactive = false) {
    return Courts.findAll({
      where: {
        [Op.or]: [
          { isActive: true },
          { isActive: !includeInactive }
        ]
      },
      order: [['id', 'asc']]
    });
  }

  getReservations(date) {
    return Reservations.findAll({
      where: { date: date },
      include: [
        'court',
        'payments',
        { model: Users, as: 'administrator', attributes: ['id', 'name', 'email', 'isAdmin'] },
        { model: Users, as: 'customer', attributes: ['id', 'name', 'email', 'isAdmin'] },
        { model: Subscriptions, as: 'subscription' }
      ]
    });
  }

  async getCurrentConfig() {
    let today = new Date();

    const season = await Seasons
      .findOne({
        where: {
          seasonStart: {
            [Op.lte]: today
          },
          seasonEnd: {
            [Op.gte]: today
          }
        }
      });

    const courts = await this.getCourts();

    return { season, courts };
  }

  createSeason(model) {
    //TODO: add seasons overlap validation
    return Seasons.create(model);
  }

  async updateSeason(id, model) {
    //TODO: add seasons overlap validation
    const entity = await Seasons.findById(id);
    return entity.update(model);
  }

  createCourt(model) {
    return Courts.create(model);
  }

  async updateCourt(id, model) {
    const entity = await Courts.findById(id);
    return entity.update(model);
  }

  async createReservation(model) {
    const existing = await Reservations
      .findOne({
        where: {
          date: model.date,
          hour: model.hour,
          courtId: model.courtId
        }
      });

    if (existing)
      throw { name: 'DomainActionError', error: 'Reservation already exists' };

    return await Reservations.create(model, { include: ['payments'] });
  }

  async updateReservation(id, model) {
    return await sequelize.transaction(async (trn) => {
      const reservation = await Reservations.findById(id, { include: ['payments'] });
      if (!reservation)
        throw { name: 'NotFound' };

      const added = model.payments.filter(e => !e.id);
      const changed = reservation.payments.filter(e => model.payments.find(p => p.id == e.id));
      const deleted = reservation.payments.filter(e => !model.payments.find(p => p.id == e.id));

      await ReservationPayments.bulkCreate(added, { transaction: trn });
      await Promise.all(changed.map(payment => payment.update(model.payments.find(e => e.id == payment.id), { transaction: trn })));
      await ReservationPayments.destroy({ where: { id: deleted.map(e => e.id) }, transaction: trn });
      return await reservation.update(model, { transaction: trn });
    });
  }

  async cancelReservation(reservation) {
    return await sequelize.transaction(async trn => {
      let allowedDiff = process.env.CANCEL_RES_ALLOWED_DIFF;
      if (reservation.type == ReservationType.SUBSCRIPTION)
        allowedDiff = process.env.CUSTOM_ALLOWED_DIFF;

      if (!reservation)
        throw { name: 'NotFound' };

      if (diff(
        moment(),
        moment(reservation.date).set('hour', reservation.hour),
        reservation.season.workingHoursStart,
        reservation.season.workingHoursEnd
      ) < allowedDiff)
        throw { name: 'DomainActionError' };

      await reservation.update({ isActive: false }, { transaction: trn });
    });
  }

  // async deleteReservation(id) {
  //   return await sequelize.transaction(async trn => {
  //     const reservation = await Reservations.findById(id, {
  //       include: [
  //         { model: Subscriptions, as: 'subscription' }
  //       ]
  //     });

  //     if (!reservation)
  //       throw { name: 'NotFound' };

  //     if (reservation.subscription) {
  //       reservation.subscription.unplayedHours += 1;
  //       await reservation.subscription.save({ transaction: trn });
  //     }

  //     return Reservations.destroy({ where: { id }, include: ['payments'] });
  //   });
  // }
}

//closed hours in interval
//'end' is always within working hours
//'start' can be anytime
//ws  = work start
//we  = work end
//nws = next work start
//nwe = next work end
//clh = closed hours per 24h
//c1  = from current time to next work start
//c2  = from current time to next work end
//dd  = day difference between first work start and last work start
function chii(start, end, ws, we) {
  if (start.isAfter(end, 'hour'))
    return 0;

  let nws = moment(start).set('hour', ws).startOf('hour');
  let nwe = moment(start).set('hour', we).startOf('hour');
  let c2 = 0;

  if (start.isBetween(nws, nwe, 'hour'))
    c2 = nwe.diff(start, 'hour');

  if (nws.isBefore(start, 'hour'))
    nws.add(1, 'day');

  if (nws.isAfter(end, 'hour'))
    return 0;

  const c1 = nws.diff(moment(start), 'hour') - c2;
  const clh = 24 - we + ws;
  const dd = moment(end).diff(nws.set('hour', ws), 'days');
  return c1 + dd * clh;
}

function diff(start, end, ws, we) {
  start = moment(start);
  end = moment(end);
  return end.diff(start, 'hour') - chii(start, end, ws, we);
}

module.exports = new ScheduleService();