alter table "UserDetails"
add temp int;

update "UserDetails" ud
set temp = subquery.year
from (select id,date_part('year', a1."startedPlaying") as year from "UserDetails" a1) as subquery
where ud.id = subquery.id;

alter table "UserDetails"
drop "startedPlaying";

alter table "UserDetails"
rename "temp" to "startedPlaying";

select * from "UserDetails";


select * from "TournamentEditions"