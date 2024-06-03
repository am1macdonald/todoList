-- +goose Up
ALTER TABLE tasks 
DROP COLUMN checklist;

-- +goose Down
ALTER TABLE tasks 
ADD checklist TEXT NOT NULL;
