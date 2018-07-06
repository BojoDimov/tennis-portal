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
      select u.id, u.fullname as name, r.points, e."createdAt", e.id as "enrollmentId" from "TournamentSchemes" s
      inner join "TournamentEditions" te
      on s."tournamentEditionId" = te.id
      inner join "Tournaments" t
      on te."tournamentId" = t.id
      inner join "SchemeEnrollments" e
      on s.id = e."schemeId"
      left join "Rankings" r
      on e."userId" = r."userId" and r."tournamentId" = t.id
      inner join "Users" u
      on u.id = e."userId"
      where s.id = ${schemeId}
      order by case when r."points" is null then 1 else 0 end, r.points desc
      `;

  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
}

function getQueue(schemeId) {
  const query = `
      select u.id, u.fullname as name, r.points, e."createdAt", e.id as "enrollmentId" from "TournamentSchemes" s
      inner join "TournamentEditions" te
      on s."tournamentEditionId" = te.id
      inner join "Tournaments" t
      on te."tournamentId" = t.id
      inner join "EnrollmentQueues" e
      on s.id = e."schemeId"
      left join "Rankings" r
      on e."userId" = r."userId" and r."tournamentId" = t.id
      inner join "Users" u
      on u.id = e."userId"
      where s.id = ${schemeId}
      order by e."createdAt" asc
      `;

  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
}

function transfer(from, to, schemeId, teamId, transaction) {
  return Promise.all([
    from.destroy({
      where: {
        schemeId: schemeId,
        userId: teamId
      },
      transaction: transaction
    }),
    to.create({
      schemeId: schemeId,
      userId: teamId
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

module.exports = {
  update,
  get,
  getQueue,
  enqueue,
  dequeue
};