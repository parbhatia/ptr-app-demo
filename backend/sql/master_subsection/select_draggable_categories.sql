select id,
    name
from draggable_category
where master_page_id = $1
order by id;