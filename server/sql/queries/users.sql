-- name: CreateUser :one
INSERT INTO users (name, email)
VALUES (?, ?)
RETURNING *;
