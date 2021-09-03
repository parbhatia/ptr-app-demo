select d.id,
    d.name,
    o.info,
    o.id as order_id
from draggable_category d
    join order_info o on o.master_store_id = d.master_store_id
where d.master_store_id = $1
ORDER BY array_position(o.info, d.id);