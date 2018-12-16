alter table "Users"
alter column "birthDate" drop not null;
alter table "Users"
alter column "gender" drop not null;
Alter table "Reservations"
add "isActive" boolean not null default false;
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