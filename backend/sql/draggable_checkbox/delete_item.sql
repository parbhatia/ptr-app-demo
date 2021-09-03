delete from draggable_checkbox
where id = $1
returning id;