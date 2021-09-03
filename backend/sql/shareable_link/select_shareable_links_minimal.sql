select id,
    type
from shareable_link
where inspection_id = $1
order by type;