insert into draggable_subcheckbox (text, draggable_checkbox_id)
values ($1, $2)
returning id,
    text;