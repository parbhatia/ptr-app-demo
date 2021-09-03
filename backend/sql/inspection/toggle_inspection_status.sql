UPDATE
    inspection
SET
    inspection_status = CASE WHEN inspection_status = 'in_progress' THEN
        'completed'::inspection_status_type
    ELSE
        'in_progress'::inspection_status_type
    END
WHERE
    id = $1
RETURNING
    inspection_status;

