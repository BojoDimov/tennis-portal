const { ReservationType } = require('../infrastructure/enums');
const {
  Seasons,
  Courts,
  Reservations,
  ReservationPayments,
  Users,
  sequelize,
  Sequelize
} = require('../db');
const Op = Sequelize.Op;

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
        { model: Users, as: 'user', attributes: ['id', 'name', 'email', 'isAdmin'] }
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

  async createReservation(model, user) {
    if (!user || !user.isAdmin)
      model.payments = [];

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

  cancelReservation(id, userId) {
    return Reservations.destroy({ where: { id, userId }, include: ['payments'] });
  }

  deleteReservation(id) {
    return Reservations.destroy({ where: { id }, include: ['payments'] });
  }
}

module.exports = new ScheduleService();