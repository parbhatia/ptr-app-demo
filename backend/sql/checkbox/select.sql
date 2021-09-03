select id,
    text,
    used,
    category_id
from checkbox
where category_id = $1
order by id;