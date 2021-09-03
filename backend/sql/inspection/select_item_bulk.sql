SELECT
    i.id,
    i.info,
    i.unique_id,
    (
        SELECT
            coalesce(json_agg(json_build_object('name', p.name, 'subsections', (
                            SELECT
                                coalesce(json_agg(json_build_object('name', s.name, 'categories', (
                                                SELECT
                                                    coalesce(json_agg(json_build_object('name', cat.name, 'checkboxes',
                                                                --not coalescing json object, but just an array
                                                                coalesce((
                                                                    SELECT
                                                                        json_agg(ch.text ORDER BY ch.id)
                                                                        FROM checkbox ch
                                                                    WHERE
                                                                        ch.category_id = cat.id
                                                                        AND ch.used = TRUE), '[]'))
                                                        ORDER BY cat.id), '[]')
                                                    FROM category cat
                                                WHERE
                                                    cat.subsection_id = s.id
                                                    AND EXISTS (
                                                        SELECT
                                                            1 FROM checkbox
                                                        WHERE
                                                            category_id = cat.id
                                                            AND used = TRUE)))
                                            ORDER BY s.id), '[]')
                                        FROM subsection s
                                    WHERE
                                        s.page_id = p.id), 'sections', (
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
                                                    pc.page_id = p.id), '[]'))
                                    ORDER BY p.id), '[]')
        FROM
            page p
        WHERE
            p.inspection_id = i.id
            AND p.name <> 'Summary') pages,
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
                p.inspection_id = i.id
                AND p.name = 'Summary') AS summary,
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
                    pc.inspection_id = $1
                    AND p.type = 'cover_photo')
                ROW) AS cover_photo,
    (
        SELECT
            row_to_json(ROW)
        FROM (
            SELECT
                *
            FROM
                users u
            WHERE
                u.id = $2)
            ROW) AS USER
FROM
    inspection i
WHERE
    i.id = $1
    AND user_id = $2
GROUP BY
    i.id;

