insert into master_page (name, master_page_store_id)
values ($1, $2)
returning id,
    name;