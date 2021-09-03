delete from file
where id = $1
returning id;