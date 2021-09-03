delete from master_category
where id = $1
returning id;