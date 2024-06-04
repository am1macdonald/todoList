-- +goose Up
CREATE TABLE tasks_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,                   
  user_id     INTEGER      NOT NULL,                               
  project_id  INTEGER,  -- project_id is now nullable
  title       VARCHAR(120) NOT NULL,                               
  description TEXT         NOT NULL,                               
  notes       TEXT         NOT NULL,                               
  deadline    INTEGER      NOT NULL,                               
  priority    INTEGER      NOT NULL,                              
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,                 
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,     
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,     
  FOREIGN KEY(user_id) REFERENCES users(id),                       
  FOREIGN KEY(project_id) REFERENCES projects(id)                  
);

INSERT INTO tasks_new (id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at)
SELECT id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at
FROM tasks;

DROP TABLE tasks;

ALTER TABLE tasks_new RENAME TO tasks;

-- +goose Down
CREATE TABLE tasks_original (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,                   
  user_id     INTEGER      NOT NULL,                               
  project_id  INTEGER      NOT NULL,  -- project_id is now NOT NULL
  title       VARCHAR(120) NOT NULL,                               
  description TEXT         NOT NULL,                               
  notes       TEXT         NOT NULL,                               
  deadline    INTEGER      NOT NULL,                               
  priority    INTEGER      NOT NULL,                              
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,                 
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,     
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,     
  FOREIGN KEY(user_id) REFERENCES users(id),                       
  FOREIGN KEY(project_id) REFERENCES projects(id)                  
);

INSERT INTO tasks_original (id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at)
SELECT id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at
FROM tasks;

DROP TABLE tasks;

ALTER TABLE tasks_original RENAME TO tasks;

