delete from master_subsection
where id = $1
returning id;