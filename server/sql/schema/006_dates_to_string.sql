-- +goose Up
CREATE TABLE tasks_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  project_id  INTEGER,
  title       VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL,
  notes       TEXT         NOT NULL,
  deadline    TEXT         NOT NULL, -- using TEXT for dates
  priority    INTEGER      NOT NULL,
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TEXT         NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT         NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

INSERT INTO tasks_new (id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at)
SELECT id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at
FROM tasks;

DROP TABLE tasks;

ALTER TABLE tasks_new RENAME TO tasks;

CREATE TABLE projects_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL,
  notes       TEXT         NOT NULL,
  deadline    TEXT         NOT NULL, -- using TEXT for dates
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TEXT         NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT         NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO projects_new (id, user_id, title, description, notes, deadline, complete, created_at, updated_at)
SELECT id, user_id, title, description, notes, deadline, complete, created_at, updated_at
FROM projects;

DROP TABLE projects;

ALTER TABLE projects_new RENAME TO projects;


-- +goose Down
ALTER TABLE tasks RENAME TO tasks_new;

CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  project_id  INTEGER,
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

INSERT INTO tasks (id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at)

SELECT id, user_id, project_id, title, description, notes, deadline, priority, complete, created_at, updated_at
FROM tasks_new;

DROP TABLE tasks_new;

ALTER TABLE projects RENAME TO projects_new;

CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL,
  notes       TEXT         NOT NULL,
  deadline    INTEGER      NOT NULL,
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO projects (id, user_id, title, description, notes, deadline, complete, created_at, updated_at)
SELECT id, user_id, title, description, notes, deadline, complete, created_at, updated_at
FROM projects_new;

DROP TABLE projects_new;
