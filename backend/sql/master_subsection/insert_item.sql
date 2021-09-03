insert into master_subsection (name, master_page_id)
values ($1, $2)
returning id,
    name;