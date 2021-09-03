SELECT
    p.id,
    p.name,
    p.type,
    e.value AS email
FROM
    inspection_person_junction ic
    INNER JOIN person p ON p.id = ic.person_id
    INNER JOIN email e ON e.person_id = p.id
WHERE
    ic.inspection_id = $1
    AND p.user_id = $2;

