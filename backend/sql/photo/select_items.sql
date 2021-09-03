SELECT
    *
FROM
    photo
WHERE
    photo_category_id = $1
ORDER BY
    array_position($2, id);

