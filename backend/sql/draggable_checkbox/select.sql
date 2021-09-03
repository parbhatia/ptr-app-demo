select *
from (
        select dch.id,
            dch.text,
            o.info,
            o.id as order_id,
            coalesce(
                (
                    select array_to_json(array_agg(row_to_json(dsubdetails)))
                    from (
                            select dsub.id,
                                dsub.text
                            from draggable_subcheckbox dsub
                                join order_info o on o.draggable_checkbox_id = dsub.draggable_checkbox_id
                            where dsub.draggable_checkbox_id = dch.id
                            order by array_position(o.info, dsub.id)
                        ) as dsubdetails
                ),
                '[]'
            ) as items
        from draggable_checkbox dch
            join order_info o on o.draggable_checkbox_id = dch.id
            join order_info oo on oo.draggable_category_id = dch.draggable_category_id
        where dch.draggable_category_id = $1
        order by array_position(oo.info, dch.id)
    ) as t;