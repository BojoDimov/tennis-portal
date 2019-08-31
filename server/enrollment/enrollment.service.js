const { Sequelize, Enrollments, Teams, Users, Rankings } = require('../db');
const { Gender } = require('../infrastructure/enums');
const Op = Sequelize.Op;
const moment = require('moment-timezone');

class EnrollmentService {
  getByUserId(userId) {
    return Enrollments
      .findAll({
        include: [
          {
            model: Teams, as: 'team',
            where: {
              [Op.or]: {
                user1Id: userId,
                user2Id: userId
              }
            }
          }
        ]
      });
  }

  getById(id) {
    return Enrollments.findById(id, {
      include: [
        {
          model: Teams, as: 'team',
          include: ['user1', 'user2']
        }
      ]
    });
  }

  getPlayers(scheme) {
    return Enrollments
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          {
            model: Teams, as: 'team',
            include: [
              {
                model: Rankings, as: 'rankings', required: false, where: { tournamentId: scheme.edition.tournamentId }
              },
              { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
              { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
            ]
          }
        ],
        order: [['createdAt']],
        limit: scheme.maxPlayerCount,
      })
      .then(enrollments => {
        enrollments.sort((a, b) => {
          let ap = ((a.team.rankings && a.team.rankings[0]) || { points: 0 }).points;
          let bp = ((b.team.rankings && b.team.rankings[0]) || { points: 0 }).points;
          return bp - ap;
        });
        enrollments.forEach((e, i) => e.dataValues.order = i + 1);
        return enrollments;
      });
  }

  getPlayersInQueue(scheme) {
    return Enrollments
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          {
            model: Teams, as: 'team',
            include: [
              { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
              { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
            ]
          }
        ],
        order: [['createdAt']],
        offset: scheme.maxPlayerCount,
      });
  }

  getAll(scheme) {
    return Promise
      .all([
        this.getPlayers(scheme),
        this.getPlayersInQueue(scheme)
      ])
      .then(([p, q]) => {
        return (p || []).concat((q || []));
      });
  }

  //Throws
  //ExistingEnrollment
  //RequirementsNotMet
  //UserHasNoInfo
  async enroll(data, transaction) {
    const existingEnrollment = await Enrollments
      .findOne({
        where: {
          schemeId: data.scheme.id,
        },
        include: [
          {
            model: Teams, as: 'team',
            where: {
              [Op.or]: {
                user1Id: [data.user1Id].concat((data.user2Id ? [data.user2Id] : [])),
                user2Id: [data.user1Id].concat((data.user2Id ? [data.user2Id] : []))
              }
            }
          }
        ]
      });

    if (existingEnrollment)
      throw { name: 'DomainActionError', error: { message: 'ExistingEnrollment' } };

    if (data.shouldValidate) {
      let errors = this.validateEnrollment(data.scheme, data.team);
      if (errors.length > 0)
        throw { name: 'DomainActionError', error: { message: 'RequirementsNotMet', errors } };
    }

    return Enrollments.create({ schemeId: data.scheme.id, teamId: data.team.id }, { transaction });
  }

  async cancelEnroll(id) {
    const enrollment = await this.getById(id);
    if (!enrollment)
      throw { name: 'NotFound' };

    await Enrollments.destroy({ where: { id: id } });
    //send emails for enrollment.team->users
  }

  validateEnrollment(scheme, team) {
    const errors = [];
    if (moment().isBefore(moment(scheme.registrationStart)))
      throw { name: 'DomainActionError', error: { message: 'RegistrationIsNotOpen' } };

    if (!team.user1.gender || !team.user1.birthDate)
      throw { name: 'DomainActionError', error: { message: 'UserHasNoInfo' } };

    if ((scheme.ageFrom && moment(team.user1.birthDate).get("years") < scheme.ageFrom)
      || (scheme.ageTo && moment(team.user1.birthDate).get("years") >= scheme.ageTo))
      errors.push('age');

    if (scheme.singleTeams) {
      if ((scheme.maleTeams && team.user1.gender != Gender.MALE)
        || (scheme.femaleTeams && team.user1.gender != Gender.FEMALE))
        errors.push('gender');
    }
    else {
      if (!team.user2.gender || !team.user2.birthDate)
        throw { name: 'DomainActionError', error: { message: 'UserHasNoInfo' } };

      if ((scheme.ageFrom && moment(team.user2.birthDate).get("years") < scheme.ageFrom)
        || (scheme.ageTo && moment(team.user2.birthDate).get("years") >= scheme.ageTo))
        errors.push('age');

      const satisfyMaleCond = scheme.maleTeams && team.user1.gender == Gender.MALE && team.user2.gender == Gender.MALE;
      const satisfyFemaleCond = scheme.femaleTeams && team.user1.gender == Gender.FEMALE && team.user2.gender == Gender.FEMALE;
      const satisfyMixedCond = scheme.mixedTeams
        && (team.user1.gender == Gender.MALE && team.user2.gender == Gender.FEMALE
          || team.user1.gender == Gender.FEMALE && team.user2.gender == Gender.MALE);

      if (!satisfyMaleCond && !satisfyFemaleCond && !satisfyMixedCond)
        errors.push('gender');
    }

    return errors;
  }
}

module.exports = new EnrollmentService();