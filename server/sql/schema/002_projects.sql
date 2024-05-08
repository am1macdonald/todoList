-- +goose Up
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL,
  notes       TEXT         NOT NULL,
  deadline    INTEGER      NOT NULL,
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  INTEGER      NOT NULL,
  updated_at  INTEGER      NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- +goose Down
DROP TABLE projects;
