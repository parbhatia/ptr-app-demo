INSERT INTO inspection(info, user_id, unique_id)
VALUES ($1, $2, $3)
returning *;