const { sequelize, SchemeEnrollments, EnrollmentQueues } = require('../db');

function update(oldScheme, newScheme) {
  let diff = 0;
  let mode = 'none';

  return sequelize
    .transaction(function (trn) {
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
                },
                transaction: trn
              }),
              EnrollmentQueues.bulkCreate(transferred.map(t => {
                t.schemeId = oldScheme.id;
                t.teamId = t.id;
                t.id = undefined;
                return t;
              }), { transaction: trn })
            ]);
          }
          else if (mode == 'add') {
            let transferred = q.slice(0, (diff > q.length ? q.length : diff));
            return Promise.all([
              SchemeEnrollments.bulkCreate(transferred.map(t => {
                t.schemeId = oldScheme.id;
                t.teamId = t.id;
                t.id = undefined;
                return t;
              }), { transaction: trn }),
              EnrollmentQueues.destroy({
                where: {
                  id: transferred.map(t => t.enrollmentId)
                },
                transaction: trn
              })
            ]);
          }
        })
        .then(() => oldScheme);
    });
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

function enroll(schemeId, teamId, mpc, registrationEnd, transaction) {
  return SchemeEnrollments
    .count({
      where: {
        schemeId: schemeId
      },
      transaction: transaction
    })
    .then(c => {
      if (c + 1 <= mpc && new Date(registrationEnd) > new Date())
        return SchemeEnrollments.create({ schemeId: schemeId, teamId: teamId }, { transaction: transaction });
      else
        return EnrollmentQueues.create({ schemeId: schemeId, teamId: teamId }, { transaction: transaction });
    });
}

function cancelEnroll(schemeId, teams, transaction) {
  let p1 = SchemeEnrollments.findAll({
    where: {
      schemeId: schemeId,
      teamId: teams
    },
    transaction: transaction
  });

  let p2 = EnrollmentQueues.findAll({
    where: {
      schemeId: schemeId,
      teamId: teams
    },
    transaction: transaction
  });

  //found item will always be only one
  return Promise
    .all([p1, p2])
    .then(([e1, e2]) => {
      return Promise
        .all([
          e1.concat(e2)[0].teamId,
          e1.concat(e2)[0].destroy()
        ]);
    })
    .then(([teamId, _]) => teamId);
}

function getEnrolled(teams) {
  let e = SchemeEnrollments.findAll({
    where: {
      teamId: teams
    }
  });

  let q = EnrollmentQueues.findAll({
    where: {
      teamId: teams
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