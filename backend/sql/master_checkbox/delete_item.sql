delete from master_checkbox
where id = $1
returning id;