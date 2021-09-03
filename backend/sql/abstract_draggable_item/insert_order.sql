--1st param: order_info foreign table column name
--2nd param: foreign table column id
insert into order_info(info, $1~)
values(DEFAULT, $2)
returning id,
    info;