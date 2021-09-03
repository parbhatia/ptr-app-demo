insert into draggable_checkbox (text, draggable_category_id)
values ($1, $2)
returning id,
    text;