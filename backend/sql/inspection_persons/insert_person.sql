insert into inspection_person_junction (inspection_id, person_id)
values ($1, $2)
returning person_id;