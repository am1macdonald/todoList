-- +goose Up
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT         NOT NULL,
  notes       TEXT         NOT NULL,
  deadline    DATETIME     NOT NULL,
  complete    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- +goose Down
DROP TABLE projects;
