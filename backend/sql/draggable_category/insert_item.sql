insert into draggable_category (name, master_store_id)
values ($1, $2)
returning id,
    name;