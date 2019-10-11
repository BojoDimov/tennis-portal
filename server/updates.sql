alter table "Users"
alter column "birthDate" drop not null;
alter table "Users"
alter column "gender" drop not null;
Alter table "Reservations"
add "isActive" boolean not null default false;
update "Users" set "isActive"= true;

update "Users" set "isActive"= true;

--update 2
--add 'abk' to reservationPaymentEnum
alter table "Subscriptions"
add column "remainingHours" int not null default 0;
update "Subscriptions" set "remainingHours" = "totalHours" - "usedHours";
update "Subscriptions" set "remainingHours" = "totalHours" 
where "usedHours" <0; 
alter table "Subscriptions" drop column "usedHours";

alter table "Users"
add "subscriptionDebt" int not null default 0,
add "reservationDebt" int not null default 0,
add "isSuperAdmin" boolean not null default false;

--------------UPDATE 3-------------
-------Tournaments, Schemes--------
alter table "Schemes"
add "seed" int;

alter table "Schemes"
alter "registrationStart" type varchar(255);

alter table "Schemes"
alter "registrationEnd" type varchar(255);



--------------UPDATE 3-------------
-------DROP TOURNAMENTS AND RECREATE DB--------
drop table if exists "Enrollments";
drop table if exists "Sets";
drop table if exists "Matches";
drop table if exists "GroupTeams";
drop table if exists "Groups";
drop table if exists "Schemes";
drop table if exists "Editions";
drop table if exists "Rankings";
drop table if exists "Tournaments";
drop type if exists "enum_Tournaments_status";
drop type if exists "enum_Editions_status"; 
drop type if exists "enum_Schemes_status";
drop type if exists "enum_Schemes_schemeType";

insert into "Teams"("createdAt", "updatedAt", "user1Id", "user2Id")
select now(), now(), "Users"."id", null from "Users";

--------------UPDATE 4-------------
alter table "Users"
add "isTrainer" boolean default false;

alter table "Users"
add "isTournamentAdmin" boolean default false;

alter type "enum_Reservations_type"
add value 'camp';

alter type "enum_Reservations_type"
add value 'other';

--------------UPDATE 5-------------
alter table "Teams"
add "wonMatches" integer default 0;

alter table "Teams"
add "totalMatches" integer default 0;

alter table "Teams"
add "wonTournaments" integer default 0;

alter table "Teams"
add "totalTournaments" integer default 0;

alter table "Teams"
add "rankingCoefficient" real default 0;

alter table "Teams"
add "globalRank" integer default -1;

UPDATE "Teams"
SET 
	"globalRank" = subquery."pos"
FROM (select id, row_number() over (order by "rankingCoefficient" desc) as "pos" 
	from "Teams" ) AS subquery
WHERE "Teams".id=subquery.id;

create or replace function recalculateGlobalRanking()
returns trigger as
$$
begin
	update "Teams"
	set 
		"globalRank" = subquery."pos"
	from (select id, row_number() over (order by "rankingCoefficient" desc) as "pos" from "Teams" ) as subquery
	where "Teams".id=subquery.id; 
	return null;
end
$$ language plpgsql;


create trigger teams_reorder_by_ranking
after update of "rankingCoefficient" on "Teams"
for each statement 
execute procedure recalculateGlobalRanking();

create trigger teams_reorder_by_ranking_after_insert
after insert or delete on "Teams"
for each statement
execute procedure recalculateGlobalRanking();

--------------UPDATE 6-------------
alter table "Teams"
add "participateInTournaments" boolean default false;

create or replace function recalculateGlobalRanking()
returns trigger as
$$
begin
	update "Teams"
	set 
		"globalRank" = subquery."pos"
	from (select 
		  	id, 
		  	row_number() over (order by "rankingCoefficient" desc) as "pos" 
		  from "Teams"
		  where "participateInTournaments" = true) as subquery
	where "Teams".id=subquery.id;
	
	update "Teams"
	set "globalRank" = -1
	where "participateInTournaments" = false;
	
	return null;
end
$$ language plpgsql;


--------------UPDATE 7-------------
alter table "Schemes"
alter "date" type timestamp with time zone;

alter table "Schemes"
add "bracketRounds" integer default 0;

alter table "Matches"
add "winnerId" integer;

alter table "Matches"
add constraint FK_Matches_Winner foreign key ("winnerId") references "Teams" (id);

alter table "Schemes"
add "finalId" int null;

alter table "Schemes"
add constraint FK_Schemes_Final foreign key ("finalId") references "Matches"("id");

alter table "Teams"
add "thumbnailId" int null;

alter table "Teams"
add constraint "FK_Teams_Files" foreign key ("thumbnailId") references "Files" (id);