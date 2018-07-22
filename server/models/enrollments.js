const { sequelize, SchemeEnrollments, EnrollmentQueues } = require('../db');

function update(oldScheme, newScheme) {
  let diff = 0;
  let mode = 'none';

  return Promise
    .all([
      get(oldScheme.id),
      getQueue(oldScheme.id)
    ])
    .then(([e, q]) => {
      if (oldScheme.schemeType == 'elimination')
        diff = e.length - newScheme.maxPlayerCount;
      else if (oldScheme.schemeType == 'round-robin')
        diff = e.length - newScheme.groupCount * newScheme.teamsPerGroup;

      if (diff > 0)
        mode = 'remove';
      else if (diff < 0) {
        mode = 'add';
        diff = -1 * diff;
      }

      if (mode == 'remove') {
        let transferred = e.slice(e.length - diff, e.length);
        return Promise.all([
          SchemeEnrollments.destroy({
            where: {
              id: transferred.map(t => t.enrollmentId)
            }
          }),
          EnrollmentQueues.bulkCreate(transferred.map(t => {
            t.schemeId = oldScheme.id;
            t.userId = t.id;
            t.id = undefined;
            return t;
          }))
        ]);
      }
      else if (mode == 'add') {
        let transferred = q.slice(0, (diff > q.length ? q.length : diff));
        return Promise.all([
          SchemeEnrollments.bulkCreate(transferred.map(t => {
            t.schemeId = oldScheme.id;
            t.userId = t.id;
            t.id = undefined;
            return t;
          })),
          EnrollmentQueues.destroy({
            where: {
              id: transferred.map(t => t.enrollmentId)
            }
          })
        ]);
      }
    })
    .then(() => oldScheme);
}

function get(schemeId) {
  const query = `
      select 
        "Teams".id as "id", 
        u1.id as "user1Id",
        u1.name as "user1Name", 
        u2.id as "user2Id",
        u2.name as "user2Name", 
        r.points, se."createdAt", 
        se.id as "enrollmentId" 
      from "TournamentSchemes" s
      inner join "TournamentEditions" te
      on s."tournamentEditionId" = te.id
      inner join "Tournaments" t
      on te."tournamentId" = t.id
      inner join "SchemeEnrollments" se
      on s.id = se."schemeId"
      left join "Rankings" r
      on se."teamId" = r."teamId" and r."tournamentId" = t.id
      inner join "Teams"
      on "Teams"."id" = se."teamId"
      inner join "Users" u1
      on "Teams"."user1Id" = u1.id
      left join "Users" u2
      on "Teams"."user2Id" = u2.id
      where s.id = ${schemeId}
      order by case when r."points" is null then 1 else 0 end, r.points desc
      `;

  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
}

function getQueue(schemeId) {
  const query = `
      select
        "Teams".id as "id",
        u1.id as "user1Id",
        u1.name as "user1Name",
        u2.id as "user2Id",
        u2.name as "user2Name",
        r.points, se."createdAt",
        se.id as "enrollmentId"
      from "TournamentSchemes" s
      inner join "TournamentEditions" te
      on s."tournamentEditionId" = te.id
      inner join "Tournaments" t
      on te."tournamentId" = t.id
      inner join "EnrollmentQueues" se
      on s.id = se."schemeId"
      left join "Rankings" r
      on se."teamId" = r."teamId" and r."tournamentId" = t.id
      inner join "Teams"
      on "Teams"."id" = se."teamId"
      inner join "Users" u1
      on "Teams"."user1Id" = u1.id
      left join "Users" u2
      on "Teams"."user2Id" = u2.id
      where s.id = ${schemeId}
      order by case when r."points" is null then 1 else 0 end, r.points desc
      `;

  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
}

function transfer(from, to, schemeId, teamId, transaction) {
  return Promise.all([
    from.destroy({
      where: {
        schemeId: schemeId,
        teamId: teamId
      },
      transaction: transaction
    }),
    to.create({
      schemeId: schemeId,
      teamId: teamId
    }, { transaction: transaction })
  ]);
}

/**
 * Transfers team from SchemeEnrollments to EnrollmentQueues
 */
function enqueue(schemeId, teamId, trn) {
  return transfer(SchemeEnrollments, EnrollmentQueues, schemeId, teamId, trn);
}

/**
 * Transfers team from EnrollmentQueues to SchemeEnrollments
 */
function dequeue(schemeId, teamId, trn) {
  return transfer(EnrollmentQueues, SchemeEnrollments, schemeId, teamId, trn);
}

function enroll(schemeId, teamId, mpc, transaction) {
  return SchemeEnrollments
    .count({
      where: {
        schemeId: schemeId
      },
      transaction: transaction
    })
    .then(c => {
      if (c + 1 <= mpc)
        return SchemeEnrollments.create({ schemeId: schemeId, teamId: teamId }, { transaction: transaction });
      else
        return EnrollmentQueues.create({ schemeId: schemeId, teamId: teamId }, { transaction: transaction });
    });
}

function cancelEnroll(schemeId, teamId, transaction) {
  let p1 = SchemeEnrollments.destroy({
    where: {
      schemeId: schemeId,
      teamId: teamId
    },
    transaction: transaction
  });

  let p2 = EnrollmentQueues.destroy({
    where: {
      schemeId: schemeId,
      teamId: teamId
    },
    transaction: transaction
  });

  return Promise.all([p1, p2]);
}

function getEnrolled(teamId) {
  let e = SchemeEnrollments.findAll({
    where: {
      teamId: teamId
    }
  });

  let q = EnrollmentQueues.findAll({
    where: {
      teamId: teamId
    }
  });

  return Promise.all([e, q])
    .then(([e, q]) => {
      return {
        enrolled: e.map(t => t.schemeId),
        queue: q.map(t => t.schemeId)
      }
    });
}

module.exports = {
  update,
  get,
  getQueue,
  enqueue,
  dequeue,
  enroll,
  cancelEnroll,
  getEnrolled
};