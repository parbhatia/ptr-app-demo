select s.id,
    s.name
from subsection s
where s.page_id = $1
order by id;