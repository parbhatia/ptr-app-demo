--1st param: order_info foreign table column name
--2nd param: foreign table column id
--3rd param: id to delete from order info array
update order_info 
set info = info - $3
where $1~ = $2 
returning info;