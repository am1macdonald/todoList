-- name: CreateUser :one
INSERT INTO users (name, email)
VALUES (?, ?)
RETURNING *;

-- name: GetUserFromEmail :one
SELECT * from users
where email = ?;
