insert into master_category (name, master_subsection_id)
values ($1, $2)
returning id,
    name;