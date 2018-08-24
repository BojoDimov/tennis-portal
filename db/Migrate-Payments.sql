alter table "SchemeEnrollments"
add column "isPaid" boolean;
update "SchemeEnrollments" set "isPaid" = false;
alter table "SchemeEnrollments"
alter "isPaid" set not null;

alter table "EnrollmentQueues"
add column "isPaid" boolean;
update "EnrollmentQueues" set "isPaid" = false;
alter table "EnrollmentQueues"
alter "isPaid" set not null;

insert into "Payments"("amount", "status", "createdAt", "updatedAt", "user1Id", "user2Id", "schemeId")
select
	case
		when s."singleTeams"=true then 25
		else 30
	end as Amount,
	'unpaid' as PaymentStatus,
	now() as CreatedAt,
	now() as UpdatedAt,
	u1."id" as User1Id,
	u2."id" as User2Id,
	s."id" as SchemeId
	--s."name" as SchemeName
	--t."id" as TeamId
	--u1."name" as User1Name
	--u2."name" as User2Name
from "SchemeEnrollments" se
inner join "TournamentSchemes" s
on s."id" = se."schemeId"
inner join "Teams" t
on t."id" = se."teamId"
inner join "Users" u1
on u1."id" = t."user1Id"
left join "Users" u2
on u2."id" = t."user2Id"
order by s."id";