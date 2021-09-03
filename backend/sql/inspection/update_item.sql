update inspection
set info = $1
where id = $2
    and user_id = $3
returning info;