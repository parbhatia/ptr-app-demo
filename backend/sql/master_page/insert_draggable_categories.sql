insert into draggable_category(name, master_page_id)
values ('Additional Notes', $1),
    ('Comments', $1)
returning id