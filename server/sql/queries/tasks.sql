-- name: AddTask :one
INSERT INTO tasks (user_id, project_id, title, description, notes, priority, checklist, deadline, complete)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id, title, description, notes, priority, checklist, deadline, complete;

-- name: GetUserTasks :many
SELECT * from tasks
where user_id = ?;

-- name: UpdateTask :one
UPDATE tasks 
set title = ?, 
  description = ?, 
  notes = ?, 
  priority = ?,
  checklist = ?,
  deadline = ?, 
  complete = ?,
  updated_at = CURRENT_TIMESTAMP
where id = ?
RETURNING id;

-- name: DeleteTask :exec
DELETE FROM tasks where id = ? and user_id = ?;
