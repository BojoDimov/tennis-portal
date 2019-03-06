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
drop table "Enrollments";
drop table "Sets";
drop table "Matches";
drop table "GroupTeams";
drop table "Groups";
drop table "Schemes";
drop table "Editions";
drop table "Rankings";
drop table "Tournaments";

drop type if exists "enum_Tournaments_status";
drop type if exists "enum_Editions_status"; 
drop type if exists "enum_Schemes_status";
drop type if exists "enum_Schemes_schemeType";
