delete from file f
where f.shareable_link_id = $1
AND f.type = 'pdf'
returning f.id;