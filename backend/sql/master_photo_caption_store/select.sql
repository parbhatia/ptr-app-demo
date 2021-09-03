SELECT
    id,
    master_photo_caption_store_id
FROM
    draggable_category
WHERE
    master_photo_caption_store_id = (
        SELECT
            id
        FROM
            master_photo_caption_store
        WHERE
            user_id = $1);

