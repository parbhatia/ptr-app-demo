select *
from file
where shareable_link_id = $1
    AND type = $2
    ORDER BY id
    ;