SELECT i.unique_id,
         i.info,
          (
         SELECT row_to_json(row)
            from (
                SELECT
                p.cdn_keyid, p.keyid
                FROM
                    photo_category phcat
                    JOIN photo p ON p.photo_category_id = phcat.id
                WHERE
                    phcat.inspection_id = i.id
                    AND p.type = 'cover_photo'
        ) row
    ) as cover_photo
FROM inspection i
WHERE i.id = $1;