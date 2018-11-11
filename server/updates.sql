alter table "Users"
alter column "birthDate" drop not null;

alter table "Users"
alter column "gender" drop not null;

Alter table "Reservations"
add "isActive" boolean not null default true;