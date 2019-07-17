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