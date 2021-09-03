INSERT INTO person (name, type, user_id)
    VALUES ($1, $2, $3)
RETURNING
    id, name;

