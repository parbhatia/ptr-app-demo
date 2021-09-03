SELECT
    i.id,
    i.info,
    i.inspection_status,
    count(*) OVER () AS total_count,
    (
        SELECT
            ts_rank_cd(i.search, websearch_to_tsquery('simple', $1), 2 | 4)) AS rank,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                p.cdn_keyid,
                p.keyid
            FROM
                photo_category phcat
                JOIN photo p ON p.photo_category_id = phcat.id
            WHERE
                phcat.inspection_id = i.id
                AND p.type = 'cover_photo')
            ROW) AS cover_photo,
    (
        SELECT
            coalesce(json_agg(json_build_object('id', p.id, 'name', p.name, 'type', p.type)
                ORDER BY p.type, p.id))
            --coalesce(array_agg(p.name), '{}'),
        FROM
            inspection_person_junction ipj
            JOIN person p ON ipj.person_id = p.id
        WHERE
            ipj.inspection_id = i.id) AS persons,
            (
         SELECT
             count(*)
         FROM
             email_record e
         WHERE
             e.inspection_id = i.id) AS email_history_count
FROM
    inspection i
WHERE
    user_id = $2
    AND i.inspection_status = ANY ($5::inspection_status_type[])
AND CASE WHEN $1 = '' THEN
    TRUE
ELSE
    i.search @@ websearch_to_tsquery('simple', $1)
    OR (i.info -> 'address')::text ILIKE $1
    OR (i.info -> 'city')::text ILIKE $1
END
ORDER BY
    i.id DESC,
    rank DESC OFFSET $3 FETCH FIRST $4 ROW ONLY;

