select c.id,
    c.name
from category c
where c.subsection_id = $1
order by id;