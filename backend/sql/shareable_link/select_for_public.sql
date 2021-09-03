SELECT
    sh.last_modified,
    sh.view_count,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                i.info -> 'address' AS address,
                i.info -> 'city' AS city,
                i.info -> 'postalcode' AS postalcode,
                i.time_created AS time_created)
            ROW) AS inspection,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                firstname,
                lastname,
                profile_pic_keyid,
                email_signature -> 'namePosition' AS position
            FROM
                users u
            WHERE
                u.id = i.user_id)
            ROW) AS USER,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                p.cdn_keyid,
                p.keyid
            FROM
                photo p
                JOIN photo_category pc ON pc.id = p.photo_category_id
            WHERE
                pc.inspection_id = sh.inspection_id
                AND p.type = 'cover_photo')
            ROW) AS cover_photo,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                f.keyid,
                f.name,
                f.extension,
                f.size
            FROM
                file f
            WHERE
                f.shareable_link_id = sh.id
                AND f.type = 'pdf')
            ROW) AS pdf_file,
    (
        SELECT
            array_to_json(array_agg(row_to_json(ROW)))
        FROM (
            SELECT
                f.keyid,
                f.name,
                f.extension,
                f.size
            FROM
                file f
            WHERE
                f.shareable_link_id = sh.id
                AND f.type = 'attachment')
            ROW) AS attachments,
    (
        SELECT
            (
                SELECT
                    json_build_object('categories', (
                            SELECT
                                json_agg(json_build_object('name', dcat.name, 'checkboxes', (
                                            SELECT
                                                coalesce(json_agg(json_build_object('text', dch.text, 'subcheckboxes',
                                                            --not coalescing json object, but just an array
                                                            coalesce((
                                                                SELECT
                                                                    json_agg(json_build_object('text', dsubch.text)
                                                                    ORDER BY array_position(o.info, dsubch.id))
                                                                    FROM draggable_subcheckbox dsubch
                                                                    JOIN order_info o ON o.draggable_checkbox_id = dsubch.draggable_checkbox_id
                                                                WHERE
                                                                    dsubch.draggable_checkbox_id = dch.id), '[]'))
                                                    ORDER BY array_position(oo.info, dch.id)), '[]')
                                                FROM draggable_checkbox dch
                                                JOIN order_info oo ON oo.draggable_category_id = dch.draggable_category_id
                                            WHERE
                                                dch.draggable_category_id = dcat.id))
                                    ORDER BY dcat.id)
                                    FROM draggable_category dcat
                                WHERE
                                    dcat.page_id = p.id), 'photos', coalesce((
                                    SELECT
                                        json_agg(ph.* ORDER BY array_position(o.info, ph.id))
                                        FROM photo ph
                                        JOIN photo_category pc ON ph.photo_category_id = pc.id
                                        JOIN order_info o ON o.photo_category_id = pc.id
                                    WHERE
                                        pc.page_id = p.id), '[]')))
            FROM
                page p
            WHERE
                p.inspection_id = sh.inspection_id
                AND p.name = 'Summary') AS summary
FROM
    shareable_link sh
    JOIN inspection i ON i.id = sh.inspection_id
WHERE
    sh.id = $1
    AND sh.shared = TRUE;

