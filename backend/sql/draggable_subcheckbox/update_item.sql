update draggable_subcheckbox
set text = $1
where id = $2
returning id,
    text;