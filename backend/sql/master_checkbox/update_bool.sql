update master_checkbox
set used = $1
where id = $2
returning id,
    used;