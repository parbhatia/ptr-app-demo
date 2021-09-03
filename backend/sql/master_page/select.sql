select p.id,
    p.name
from master_page p
    join order_info oo on oo.master_page_store_id = p.master_page_store_id
where p.master_page_store_id = $1
order by array_position(oo.info, p.id);