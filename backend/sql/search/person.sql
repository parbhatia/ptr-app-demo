SELECT
    p.id,
    p.name,
    p.type,
    count(*) OVER () AS total_count,
    (
        SELECT
            ts_rank_cd(p.search, websearch_to_tsquery('simple', $1))) AS rank
FROM
    person p
WHERE
    p.user_id = $2
    AND p.type = ANY ($3::person_type[])
    AND CASE WHEN $6 = NULL THEN
        TRUE
    ELSE
        p.id NOT IN (
            --probe in inspection junction for person and inspection already existing
            SELECT
                ic.person_id FROM inspection_person_junction ic
            WHERE
                ic.person_id = p.id
                AND ic.inspection_id = nullif ($6, 'null')::int)
    END
    AND CASE WHEN $1 = '' THEN
        TRUE
    ELSE
        p.search @@ websearch_to_tsquery('simple', $1)
        OR p.name ILIKE $1
    END
ORDER BY
    CASE WHEN $7 = 'recent' THEN
        p.id
    END DESC,
    CASE WHEN $7 = 'alphabetic' THEN
        p.name
    END ASC,
    rank DESC OFFSET $4 FETCH FIRST $5 ROW ONLY;

