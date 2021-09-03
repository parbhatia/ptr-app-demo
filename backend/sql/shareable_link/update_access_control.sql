UPDATE
    shareable_link
SET
    shared = $2
WHERE
    id = $1
RETURNING
    id,
    shared;

