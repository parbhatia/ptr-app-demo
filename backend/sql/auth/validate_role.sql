--1st param: foreign table_name
--2nd param: foreign table primary key value
select user_id
from $1~
where id = $2;