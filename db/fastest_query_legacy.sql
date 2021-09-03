select i.id,
    i.info,
    coalesce(
        (
            select array_to_json(array_agg(row_to_json(pages_info)))
            from (
                    select name,
                        coalesce(
                            (
                                select array_to_json(array_agg(row_to_json(subsection_info)))
                                from (
                                        select name,
                                            coalesce(
                                                (
                                                    select array_to_json(array_agg(row_to_json(category_info)))
                                                    from (
                                                            select name,
                                                                coalesce(
                                                                    (
                                                                        select array_to_json(array_agg(row_to_json(checkbox_info)))
                                                                        from (
                                                                                select text,
                                                                                    used
                                                                                from checkbox
                                                                                where category_id = category.id
                                                                                    AND used = true
                                                                                order by time_created
                                                                            ) as checkbox_info
                                                                    ),
                                                                    '{}'
                                                                ) as checkboxes
                                                            from category
                                                            where subsection_id = subsection.id
                                                                AND EXISTS (
                                                                    select 1
                                                                    from checkbox
                                                                    where category_id = category.id
                                                                        AND used = true
                                                                )
                                                            order by time_created
                                                        ) as category_info
                                                ),
                                                '{}'
                                            ) as categories
                                        from subsection
                                        where page_id = page.id
                                        order by time_created
                                    ) as subsection_info
                            ),
                            '{}'
                        ) as subsections,
                        coalesce(
                            (
                                select array_to_json(array_agg(row_to_json(draggable_checkbox_info)))
                                from (
                                        select name,
                                            coalesce(
                                                (
                                                    select array_to_json(
                                                            array_agg(row_to_json(draggable_subcheckbox_info))
                                                        )
                                                    from (
                                                            select dch.text,
                                                                coalesce(
                                                                    (
                                                                        select array_to_json(array_agg(row_to_json(checkbox_info)))
                                                                        from (
                                                                                select dsub.text
                                                                                from draggable_subcheckbox dsub
                                                                                    join order_info o on o.draggable_checkbox_id = dsub.draggable_checkbox_id
                                                                                where dsub.draggable_checkbox_id = dch.id
                                                                                order by array_position(o.info, dsub.id)
                                                                            ) as checkbox_info
                                                                    ),
                                                                    '{}'
                                                                ) as subcheckboxes
                                                            from draggable_checkbox dch
                                                                join order_info oo on oo.draggable_category_id = dch.draggable_category_id
                                                            where dch.draggable_category_id = dcat.id
                                                            order by array_position(oo.info, dch.id)
                                                        ) as draggable_subcheckbox_info
                                                ),
                                                '{}'
                                            ) as checkboxes
                                        from draggable_category dcat
                                        where page_id = page.id
                                        order by time_created
                                    ) as draggable_checkbox_info
                            ),
                            '{}'
                        ) as categories
                    from page
                    where inspection_id = i.id
                        AND page.name <> 'Summary'
                    order by time_created
                ) as pages_info
        ),
        '{}'
    ) as pages,
    (
        select coalesce(
                (
                    select array_to_json(array_agg(row_to_json(draggable_checkbox_info)))
                    from (
                            select name,
                                coalesce(
                                    (
                                        select array_to_json(
                                                array_agg(row_to_json(draggable_subcheckbox_info))
                                            )
                                        from (
                                                select dch.text,
                                                    coalesce(
                                                        (
                                                            select array_to_json(array_agg(row_to_json(checkbox_info)))
                                                            from (
                                                                    select dsub.text
                                                                    from draggable_subcheckbox dsub
                                                                        join order_info o on o.draggable_checkbox_id = dsub.draggable_checkbox_id
                                                                    where dsub.draggable_checkbox_id = dch.id
                                                                    order by array_position(o.info, dsub.id)
                                                                ) as checkbox_info
                                                        ),
                                                        '{}'
                                                    ) as subcheckboxes
                                                from draggable_checkbox dch
                                                    join order_info oo on oo.draggable_category_id = dch.draggable_category_id
                                                where dch.draggable_category_id = dcat.id
                                                order by array_position(oo.info, dch.id)
                                            ) as draggable_subcheckbox_info
                                    ),
                                    '{}'
                                ) as checkboxes
                            from draggable_category dcat
                            where page_id = page.id
                            order by time_created
                        ) as draggable_checkbox_info
                ),
                '{}'
            ) as categories
        from page
        where inspection_id = i.id
            AND page.name = 'Summary'
    ) as summary,
    sp.id_array as summary_photos,
    sp.caption_array as summary_photos_captions,
    sp.cover_photo as cover_photo
from inspection i
    join summary_photos sp on sp.inspection_id = i.id
where i.id = 248
    AND user_id = 1;