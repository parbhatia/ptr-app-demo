update file
set name = $2
where id = $1
returning id,
    keyid,
    name;