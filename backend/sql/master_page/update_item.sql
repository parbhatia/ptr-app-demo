update master_page
set name = $1
where id = $2
returning id,
    name;