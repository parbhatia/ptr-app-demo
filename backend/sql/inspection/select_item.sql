SELECT *
from inspection
where id = $1
    and user_id = $2;