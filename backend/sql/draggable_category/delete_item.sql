delete from draggable_category
where id = $1
returning id;