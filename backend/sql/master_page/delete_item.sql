delete from master_page
where id = $1
returning id;