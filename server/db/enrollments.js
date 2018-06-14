module.exports = {
  getEnrollments: (db, schemeId, limit) => {
    const query = `
      select u.id, u.fullname as name, r.points from "TournamentSchemes" s
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
      limit ${limit}
      `;

    return db.query(query, { type: db.QueryTypes.SELECT });
  },
  getEnrollmentsQueue: (db, schemeId) => {
    const query = `
      select u.id, u.fullname as name, r.points from "TournamentSchemes" s
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
}