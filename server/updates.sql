alter table "Users"
alter column "birthDate" drop not null;

alter table "Users"
alter column "gender" drop not null;

Alter table "Reservations"
add "isActive" boolean not null default false;

update "Users" set "isActive"= true;

--------------UPDATE 3-------------
-------Tournaments, Schemes--------
alter table "Schemes"
add "seed" int;

alter table "Schemes"
alter "registrationStart" type varchar(255);

alter table "Schemes"
alter "registrationEnd" type varchar(255);