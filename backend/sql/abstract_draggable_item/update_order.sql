--1st param: order_info foreign table_name
--2nd param: order_info foreign table_key
--3rd param: array to replace
update order_info
set info = $3
where $1~ = $2
returning info;