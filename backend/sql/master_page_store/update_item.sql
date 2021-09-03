update master_page_store
set name = $1
where id = $2
    AND user_id = $3
returning id,
    name;