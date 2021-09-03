select p.id,
    p.name
from page p
where p.inspection_id = $1
order by id;