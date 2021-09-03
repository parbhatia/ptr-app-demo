--1st param: order_info foreign table_name
--2nd param: order_info foreign table_key
--3rd param: array to insert 
update order_info
set info = array_cat(info, $3)
where $1~ = $2
returning info;