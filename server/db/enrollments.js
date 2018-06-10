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
      order by r.points desc
      limit ${limit}
      `;

    return db.query(query, { type: db.QueryTypes.SELECT });
  }
}