select cat.id,
    cat.name
from master_category cat
    join order_info oo on oo.master_subsection_id = cat.master_subsection_id
where cat.master_subsection_id = $1
order by array_position(oo.info, cat.id);