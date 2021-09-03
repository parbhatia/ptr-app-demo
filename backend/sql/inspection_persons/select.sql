SELECT
    p.id,
    p.name,
    p.type
FROM
    inspection_person_junction ic
    INNER JOIN person p ON p.id = ic.person_id
WHERE
    ic.inspection_id = $1
    AND user_id = $2
ORDER BY
    p.type,
    p.id;

