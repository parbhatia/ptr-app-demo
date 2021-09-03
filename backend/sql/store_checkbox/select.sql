select *
from (
        select sch.id,
            sch.text,
            sch.used,
            coalesce(
                (
                    select array_to_json(array_agg(row_to_json(ssubdetails)))
                    from (
                            select ssub.id,
                                ssub.text,
                                ssub.used
                            from store_subcheckbox ssub
                            where ssub.store_checkbox_id = sch.id
                            order by ssub.id
                        ) as ssubdetails
                ),
                '[]'
            ) as items
        from store_checkbox sch
        where sch.store_category_id = $1
        order by sch.id
    ) as t;