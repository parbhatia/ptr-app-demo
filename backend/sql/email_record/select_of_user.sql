SELECT
    e.*,
    p.name AS person_name
FROM
    email_record e
    LEFT JOIN person p ON p.id = e.person_id
WHERE
    e.user_id = $1
ORDER BY
    e.time_sent DESC
LIMIT $2;

