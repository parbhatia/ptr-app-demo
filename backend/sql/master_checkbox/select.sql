select mm.id,
    mm.text,
    mm.used
from master_checkbox mm
    join order_info oo on oo.master_category_id = mm.master_category_id
where mm.master_category_id = $1
order by array_position(oo.info, mm.id);