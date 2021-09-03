insert into master_page_store (name, user_id)
values ($1, $2)
returning id,
    name,
    user_id;