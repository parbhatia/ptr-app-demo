delete from draggable_subcheckbox
where id = $1
returning id;