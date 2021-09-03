insert into checkbox (text, used, category_id)
values ($1, true, $2)
returning id,
    text,
    used,
    category_id;