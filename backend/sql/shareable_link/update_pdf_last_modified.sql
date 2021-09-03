update file set last_modified = now()
where shareable_link_id = $1
AND type = 'pdf'
returning id;