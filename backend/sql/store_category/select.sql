select d.id,
    d.name
from store_category d
where d.store_id = $1
order by d.time_created;