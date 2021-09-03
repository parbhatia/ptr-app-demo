update person
set name = $2
where id = $1
    AND user_id = $3
returning id,
    name;