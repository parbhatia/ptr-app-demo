insert into master_checkbox (text, master_category_id)
values ($1, $2)
returning id,
    used,
    text;