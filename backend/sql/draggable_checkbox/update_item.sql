update draggable_checkbox
set text = $1
where id = $2
returning id,
    text;