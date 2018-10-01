const { Sequelize, Enrollments, Teams, Users, Rankings } = require('../db');
const Op = Sequelize.Op;

class EnrollmentService {
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
                model: Rankings, as: 'rankings'
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
        return enrollments.sort((a, b) => {
          let ap = ((a.team.rankings || []).find(r => r.tournamentId == scheme.edition.tournamentId) || { points: 0 }).points;
          let bp = ((b.team.rankings || []).find(r => r.tournamentId == scheme.edition.tournamentId) || { points: 0 }).points;
          return bp - ap;
        });
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
        return {
          enrolled: p,
          queued: q
        };
      });
  }

  enroll(data) {
    return Enrollments
      .findOne({
        where: {
          schemeId: data.schemeId,
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
      })
      .then(enrollment => {
        if (enrollment)
          throw { name: 'InvalidAction' };

        return Enrollments.create({ schemeId: data.schemeId, teamId: data.teamId });
      });
  }

  cancelEnroll(id) {
    return Enrollments
      .destroy({ where: { id: id } });
  }

  transfer(scheme) {

  }
}

module.exports = new EnrollmentService();