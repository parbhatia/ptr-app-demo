delete from inspection_person_junction
where inspection_id = $1
    AND person_id = $2
returning person_id;