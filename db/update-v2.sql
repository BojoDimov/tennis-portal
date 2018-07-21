alter table "Users"
add "isAdmin" boolean default false;

alter table "Users"
alter "isAdmin" set not null;

update "Users" set "isAdmin" = true where "id" = 32;