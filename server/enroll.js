let query = `
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
where s.id =1
order by r.points desc
limit 10
`;

const { db } = require('./sequelize.config');

db.query(query, { type: db.QueryTypes.SELECT })
  .then(res => {
    console.log(res);
  })

