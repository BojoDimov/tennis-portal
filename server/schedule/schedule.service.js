const moment = require('moment-timezone');
const { ReservationType, ReservationPayment } = require('../infrastructure/enums');
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
      where: {
        date: date,
        isActive: true
      },
      include: [
        'court',
        {
          model: ReservationPayments, as: 'payments', include: [
            { model: Subscriptions, as: 'subscription', include: ['season'] }
          ]
        },
        { model: Users, as: 'administrator', attributes: ['id', 'name', 'email', 'isAdmin'] },
        { model: Users, as: 'customer', attributes: ['id', 'name', 'email', 'isAdmin'] },
        { model: Subscriptions, as: 'subscription', include: ['season'] }
      ]
    });
  }

  async getReservationsByUserId(userId) {
    return await Reservations.findAll({
      where: {
        customerId: userId
      },
      include: [
        { model: Courts, as: 'court', attributes: ['id', 'name'] },
        { model: Seasons, as: 'season', attributes: ['id', 'name'] }
      ],
      order: [['date', 'desc'], ['hour', 'desc']]
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

  //Throws:
  //exist
  //typeRequired
  //customerRequired
  //subscriptionRequired
  //usedHoursExceedTotalHours
  //paymentSubscriptionRequired
  //typeSubscriptionAndHasPaymentSubscription
  async createReservation(model) {
    const now = moment().startOf('hour');
    const resMoment = moment(model.date).set('hour', model.hour).startOf('hour');

    if (now.isAfter(resMoment))
      throw { name: 'DomainActionError', error: ['reservationInThePast'] }

    let transaction;
    try {
      transaction = await sequelize.transaction({ autocommit: false });
      const existing = await Reservations
        .findOne({
          where: {
            date: model.date,
            hour: model.hour,
            courtId: model.courtId,
            isActive: true
          }
        });

      if (existing)
        throw { name: 'DomainActionError', error: ['exist'] };

      this.validateReservation(model);

      if (model.type == ReservationType.SUBSCRIPTION) {
        //increment subscription
        const subscription = await Subscriptions.findById(model.subscriptionId, {
          lock: transaction.LOCK.UPDATE,
          transaction
        });

        //subscription.usedHours++;
        subscription.remainingHours--;
        if (subscription.remainingHours < 0)
          throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
        await subscription.save({ transaction });
      }

      const created = await Reservations.create(model, { transaction });
      created.payments = model.payments;
      await this.handlePayments(created, true, transaction);

      await transaction.commit();
      return created;
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  //this may be a little unnecessary,
  //so i am using less restricting version of this.
  async loadReservationIsolationLocks(id, transaction) {
    const reservation = await Reservations.findById(id, {
      include: [
        'subscription',
        {
          model: ReservationPayments,
          as: 'payments',
          include: [
            {
              model: Subscriptions,
              as: 'subscription',
              lock: {
                level: transaction.LOCK.UPDATE,
                of: Subscriptions
              }
            }
          ]
        }
      ],
      lock: {
        level: transaction.LOCK.UPDATE,
        of: Subscriptions
      }
    });

    if (!reservation)
      throw { name: 'NotFound' };

    return reservation;
  }

  async loadReservation(id, transaction) {
    const reservation = await Reservations.findById(id, {
      include: [
        'subscription',
        'season',
        {
          model: ReservationPayments,
          as: 'payments',
          include: ['subscription']
        }
      ],
      transaction
    });

    if (!reservation)
      throw { name: 'NotFound' };
    return reservation;
  }

  //Throws:
  //typeRequired
  //customerRequired
  //subscriptionRequired
  //usedHoursExceedTotalHours
  //paymentSubscriptionRequired
  //typeSubscriptionAndHasPaymentSubscription
  async updateReservation(id, model) {
    let transaction;
    try {
      transaction = await sequelize.transaction({ autocommit: false });
      const reservation = await this.loadReservation(id, transaction);
      this.validateReservation(model);

      if (model.type == ReservationType.SUBSCRIPTION) {
        if (reservation.type == ReservationType.SUBSCRIPTION) {
          if (model.subscriptionId != reservation.subscriptionId) {
            //increment new subscription
            //decrement existing subscription
            const subscription = await Subscriptions.findById(model.subscriptionId, {
              lock: transaction.LOCK.UPDATE,
              transaction
            });

            //subscription.usedHours++;
            //reservation.subscription.usedHours--;
            subscription.remainingHours--;
            reservation.subscription.remainingHours++;
            if (subscription.remainingHours < 0)
              throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
            await subscription.save({ transaction });
            await reservation.subscription.save({ transaction });
          }
          else {
            //they are the same, do nothing
          }
        }
        else {
          //increment subscription
          const subscription = await Subscriptions.findById(model.subscriptionId, {
            lock: transaction.LOCK.UPDATE,
            transaction
          });

          //subscription.usedHours++;
          subscription.remainingHours--;
          if (subscription.remainingHours < 0)
            throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
          await subscription.save({ transaction });
        }
      }
      else {
        //we are changing from subscribed reservation to other type
        if (reservation.type == ReservationType.SUBSCRIPTION) {
          //decrement existing subscription
          //reservation.subscription.usedHours--;
          reservation.subscription.remainingHours++;
          await reservation.subscription.save({ transaction });
        }
      }

      const updated = await reservation.update(model, { transaction });
      updated.payments = model.payments;
      await this.handlePayments(updated, false, transaction);

      await transaction.commit();
      return updated;
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  //Throws:
  //maxAllowedTimeDiff
  async cancelReservation(id) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const reservation = await this.loadReservation(id, transaction);
      this.validateCanBeCanceled(reservation);

      if (reservation.type == ReservationType.SUBSCRIPTION) {
        //decrement subscription
        //reservation.subscription.usedHours--;
        reservation.subscription.remainingHours++;
        await reservation.subscription.save({ transaction });
      }

      reservation.payments.forEach(async payment => {
        if (payment.type == ReservationPayment.SUBS_ZONE_1 || payment.type == ReservationPayment.SUBS_ZONE_2) {
          //decrement subscription
          //payment.subscription.usedHours--;
          payment.subscription.remainingHours++;
          await payment.subscription.save({ transaction });
        }
      });

      const updated = await reservation.update({ isActive: false }, { transaction });
      await transaction.commit();
      return updated;
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async shuffleReservation(reservation1, reservation2, admin) {
    if (!reservation1 || !reservation2)
      throw { name: 'DomainActionError', error: { message: 'invalid' } };

    const now = moment().startOf('hour');
    const res1Moment = moment(reservation1.date).set('hour', reservation1.hour).startOf('hour');
    const res2Moment = moment(reservation2.date).set('hour', reservation2.hour).startOf('hour');

    if (res1Moment.diff(now, 'hour') < 0 || res2Moment.diff(now, 'hour') < 0)
      throw { name: 'DomainActionError', error: { message: 'invalidTime' } };

    let transaction;
    try {
      transaction = await sequelize.transaction();
      if (reservation1.id)
        reservation1 = await Reservations.findById(reservation1.id);

      if (reservation2.id)
        reservation2 = await Reservations.findById(reservation2.id);

      let temp1 = {
        hour: reservation1.hour,
        courtId: reservation1.courtId,
        administratorId: admin.id
      };

      let temp2 = {
        hour: reservation2.hour,
        courtId: reservation2.courtId,
        administratorId: admin.id
      };

      if (reservation1.id)
        await reservation1.update(temp2, { transaction });

      if (reservation2.id)
        await reservation2.update(temp1, { transaction });

      return await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  //Throws:
  //usedHoursExceedTotalHours
  async handlePayments(reservation, isNewReservation, transaction) {
    //handle deleted
    if (!isNewReservation) {
      const deleted = await ReservationPayments.findAll({
        where: {
          id: {
            [Op.notIn]: reservation.payments.filter(p => p.id).map(p => p.id)
          },
          reservationId: reservation.id
        },
        include: ['subscription'],
        transaction
      });

      for (const payment of deleted) {
        if (payment.type == ReservationPayment.SUBS_ZONE_1 || payment.type == ReservationPayment.SUBS_ZONE_2) {
          //payment has subscription
          //decrement subscription
          //payment.subscription.usedHours--;
          payment.subscription.remainingHours++;
          await payment.subscription.save({ transaction });
        }

        await payment.destroy({ transaction });
      }
    }

    //handle create and update
    for (const payment of reservation.payments) {
      //handle created and updated
      if (payment.id) {
        //update payment
        const existingPayment = await ReservationPayments.findById(payment.id, { include: ['subscription'] });
        if (payment.type == ReservationPayment.SUBS_ZONE_1 || payment.type == ReservationPayment.SUBS_ZONE_2) {
          const subscription = await Subscriptions.findById(payment.subscriptionId, { transaction });

          if (existingPayment.type == ReservationPayment.SUBS_ZONE_1 || existingPayment.type == ReservationPayment.SUBS_ZONE_2) {
            if (subscription.id != existingPayment.subscriptionId) {
              //both existing and new payments are subscription
              //increment new payment subscription
              //decrement existing payment subscription
              //subscription.usedHours++;
              //existingPayment.subscription.usedHours--;
              subscription.remainingHours--;
              existingPayment.subscription.remainingHours++;
              if (subscription.remainingHours < 0)
                throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
              await subscription.save({ transaction });
              await existingPayment.subscription.save({ transaction });
            }
            else {
              //payment subscription hasnt changed
              //do nothing
            }
          }
          else {
            //existing payment wasn't subscription, now it is
            //increment new payment subscription
            //subscription.usedHours++;
            subscription.remainingHours--;
            if (subscription.remainingHours < 0)
              throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
            await subscription.save({ transaction });
          }
        }
        else {
          //this should only be executed if we are not of subscription type now
          if (existingPayment.type == ReservationPayment.SUBS_ZONE_1 || existingPayment.type == ReservationPayment.SUBS_ZONE_2) {
            //existing payment was subsciption, now it isn't
            //decrement existing payment subscription
            // existingPayment.subscription.usedHours--;
            existingPayment.subscription.remainingHours++;
            await existingPayment.subscription.save({ transaction });
          }
        }

        await existingPayment.update(payment, { transaction });
      }
      else {
        //create payment
        if (payment.type == ReservationPayment.SUBS_ZONE_1 || payment.type == ReservationPayment.SUBS_ZONE_2) {
          //new payment has subscription
          //increment subscription
          const subscription = await Subscriptions.findById(payment.subscriptionId, { transaction });

          // subscription.usedHours++;
          subscription.remainingHours--;
          if (subscription.remainingHours < 0)
            throw { name: 'DomainActionError', error: ['usedHoursExceedTotalHours'] };
          await subscription.save({ transaction });
        }

        payment.reservationId = reservation.id;
        await ReservationPayments.create(payment, { transaction });
      }
    }
  }

  //Throws:
  //typeRequired
  //customerRequired
  //subscriptionRequired
  //paymentSubscriptionRequired
  //typeSubscriptionAndHasPaymentSubscription
  validateReservation(reservation) {
    const errors = [];

    if (!reservation.type)
      errors.push('typeRequired');

    if ((reservation.type == ReservationType.USER || reservation.type == ReservationType.SUBSCRIPTION)
      && !reservation.customerId)
      errors.push('customerRequired');

    if (reservation.type == ReservationType.SUBSCRIPTION && !reservation.subscription)
      errors.push('subscriptionRequired');

    if (reservation.payments.find(p =>
      (p.type == ReservationPayment.SUBS_ZONE_1 || p.type == ReservationPayment.SUBS_ZONE_2)
      && !p.subscription))
      errors.push('paymentSubscriptionRequired');

    if (reservation.type == ReservationType.SUBSCRIPTION
      && reservation.payments.find(p =>
        (p.type == ReservationPayment.SUBS_ZONE_1 || p.type == ReservationPayment.SUBS_ZONE_2)))
      errors.push('typeSubscriptionAndHasPaymentSubscription');

    if (errors.length > 0)
      throw { name: 'DomainActionError', error: errors };
  }

  //Throws:
  //maxAllowedTimeDiff
  validateCanBeCanceled(reservation) {
    if (reservation.type == ReservationType.TOURNAMENT
      || reservation.type == ReservationType.SERVICE)
      return;

    let allowedDiff = process.env.CANCEL_RES_ALLOWED_DIFF;
    if (reservation.type == ReservationType.SUBSCRIPTION)
      allowedDiff = process.env.CUSTOM_ALLOWED_DIFF;

    if (diff(
      moment(),
      moment(reservation.date).set('hour', reservation.hour),
      reservation.season.workingHoursStart,
      reservation.season.workingHoursEnd
    ) < allowedDiff)
      throw { name: 'DomainActionError', error: ['maxAllowedTimeDiff'] };
  }
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