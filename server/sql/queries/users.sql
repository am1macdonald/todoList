-- name: CreateAuthor :one
INSERT INTO users (name, email)
VALUES (?, ?)
RETURNING *;
