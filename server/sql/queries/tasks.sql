-- name: AddTask :one
INSERT INTO tasks (user_id, project_id, title, description, notes, priority, deadline, complete)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id, title, description, notes, priority, deadline, complete;

-- name: GetUserTasks :many
SELECT * from tasks
where user_id = ?;

-- name: UpdateTask :one
UPDATE tasks 
set title = ?, 
  description = ?, 
  notes = ?, 
  priority = ?,
  deadline = ?, 
  complete = ?,
  updated_at = CURRENT_TIMESTAMP
where id = ?
RETURNING id;

-- name: SetTaskProject :exec
UPDATE tasks 
  set project_id = ?
where id in (sqlc.slice(ids));

-- name: DeleteTask :exec
DELETE FROM tasks where id = ? and user_id = ?;
