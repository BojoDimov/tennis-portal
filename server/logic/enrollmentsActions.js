module.exports = { _get, _get_queue, _update }

function _update(oldScheme, newScheme) {
  let diff = 0;
  let mode = 'none';
  if (oldScheme.schemeType == 'elimination')
    diff = oldScheme.maxPlayerCount - newScheme.maxPlayerCount;
  else if (oldScheme.schemeType == 'round-robin')
    diff = oldScheme.groupCount * oldScheme.teamsPerGroup - newScheme.groupCount * newScheme.teamsPerGroup;

  if (diff > 0)
    mode = 'remove';
  else if (diff < 0) {
    mode = 'add';
    diff = -1 * diff;
  }

  return Promise.all([
    _get(db, oldScheme.id),
    _get_queue(db, oldScheme.id)
  ]).then(([e, q]) => {
    if (mode == 'remove') {
      let transferred = e.slice(e.length - diff, e.length);
      return Promise.all([
        SchemeEnrollments.destroy({
          where: {
            id: transferred.map(t => t.enrollmentId)
          }
        }),
        EnrollmentsQueue.bulkCreate(transferred.map(t => {
          t.schemeId = oldScheme.id;
          t.userId = t.id;
          t.id = undefined;
          return t;
        }))
      ]);
    }
    else if (mode == 'add') {
      let transferred = q.slice(0, diff);
      return Promise.all([
        SchemeEnrollments.bulkCreate(transferred.map(t => {
          t.schemeId = oldScheme.id;
          t.userId = t.id;
          t.id = undefined;
          return t;
        })),
        EnrollmentsQueue.destroy({
          where: {
            id: transferred.map(t => t.enrollmentId)
          }
        })
      ]);
    }
  }).then(() => oldScheme);
}

function _get(db, schemeId) {
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

  return db.query(query, { type: db.QueryTypes.SELECT });
}

function _get_queue(db, schemeId) {
  const query = `
      select u.id, u.fullname as name, r.points, e."createdAt", e.id as "enrollmentId" from "TournamentSchemes" s
      inner join "TournamentEditions" te
      on s."tournamentEditionId" = te.id
      inner join "Tournaments" t
      on te."tournamentId" = t.id
      inner join "EnrollmentsQueues" e
      on s.id = e."schemeId"
      left join "Rankings" r
      on e."userId" = r."userId" and r."tournamentId" = t.id
      inner join "Users" u
      on u.id = e."userId"
      where s.id = ${schemeId}
      order by e."createdAt" asc
      `;

  return db.query(query, { type: db.QueryTypes.SELECT });
}