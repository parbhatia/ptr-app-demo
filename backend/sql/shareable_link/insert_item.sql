insert into shareable_link(id, inspection_id, type)
values($1, $2, $3)
returning id;