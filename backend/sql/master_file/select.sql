select *
from file
where master_file_store_id = $1
ORDER BY id
;