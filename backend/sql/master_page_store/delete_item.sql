delete from master_page_store
where id = $1
    AND user_id = $2
returning id;