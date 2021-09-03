update shareable_link
set view_count = view_count + 1
where id = $1
returning id;