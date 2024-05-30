-- name: AddProject :one
INSERT INTO projects (user_id, title, description, notes, deadline, complete)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id, title, description, notes, deadline, complete;

-- name: GetUserProjects :many
SELECT * from projects
where user_id = ?;

-- name: UpdateProject :one
UPDATE projects 
set title = ?, 
  description = ?, 
  notes = ?, 
  deadline = ?, 
  complete = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING id;

-- name: DeleteProject :exec
DELETE FROM projects where id = ? and user_id = ?;
