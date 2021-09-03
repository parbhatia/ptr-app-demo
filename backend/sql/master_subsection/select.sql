select s.id,
    s.name
from master_subsection s
    join order_info oo on oo.master_page_id = s.master_page_id
where s.master_page_id = $1
order by array_position(oo.info, s.id);