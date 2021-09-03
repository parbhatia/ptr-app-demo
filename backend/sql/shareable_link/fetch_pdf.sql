select f.*,
(select f.last_modified > f.time_created) as files_need_merge,
--compare file's shareable link's inspection's last modified time with file's time created
(select i.id 
from inspection i
inner join shareable_link sh on sh.inspection_id = i.id
where i.last_modified > f.time_created
AND sh.id = $1
) as inspection_needing_update
from file f
where f.shareable_link_id = $1
    AND f.type = 'pdf';