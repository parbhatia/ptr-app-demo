update checkbox ch
set used = $2
where ch.id = $1
returning id,
    used;