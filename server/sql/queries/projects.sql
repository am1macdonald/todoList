-- name: AddProject :one
INSERT INTO projects (user_id, title, description, notes, deadline, complete)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id, title, description, notes, deadline, complete;

-- name: GetUserProjects :many
SELECT 
    p.*, 
    CAST(IFNULL(GROUP_CONCAT(t.id, ', '), '') AS TEXT) AS task_ids
FROM 
    projects p
LEFT JOIN 
    tasks t 
ON 
    p.id = t.project_id
WHERE 
    p.user_id = ?
GROUP BY 
    p.id;


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
