--1st param: order_info foreign table_key
--2nd param: foreign key id
SELECT
    id,
    info
FROM
    order_info
WHERE
    $1~ = $2;

