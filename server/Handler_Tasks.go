package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/session"
	"github.com/am1macdonald/to-do-list/server/internal/task"
)

func DbTaskToTask(p *database.Task) *task.Task {
	return &task.Task{
		ID:          p.ID,
		UserID:      p.UserID,
		Title:       p.Title,
		Description: p.Description,
		Notes:       p.Notes,
		Priority:    p.Priority,
		Deadline:    p.Deadline,
		Complete:    p.Complete,
	}
}

func (cfg *apiConfig) HandleGetTasks(w http.ResponseWriter, r *http.Request, s *session.Session) {
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		errorResponse(w, 500, err)
		return
	}
	if int(s.Data.UserID) != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}
	dbTasks, err := cfg.db.GetUserTasks(r.Context(), userID)
	if err != nil {
		errorResponse(w, 500, err)
		return
	}
	tasks := make([]task.Task, len(dbTasks))
	for i, t := range dbTasks {
		tasks[i] = *DbTaskToTask(&t)
	}
	jsonResponse(w, 200, tasks)
}

func (cfg *apiConfig) HandleAddTask(w http.ResponseWriter, r *http.Request, s *session.Session) {
	type projectRequestBody struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Notes       string `json:"notes"`
		Deadline    int64  `json:"deadline"`
		Complete    bool   `json:"complete"`
	}
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}

	if int(s.Data.UserID) != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}

	var req projectRequestBody
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}

	project, err := cfg.db.AddProject(r.Context(), database.AddProjectParams{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		Notes:       req.Notes,
		Deadline:    req.Deadline,
		Complete:    req.Complete,
	})

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to add project"))
		return
	}

	jsonResponse(w, 200, project)
}

func (cfg *apiConfig) HandleUpdateTask(w http.ResponseWriter, r *http.Request, s *session.Session) {
	type taskRequestBody struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Priority    int64  `json:"priority"`
		Notes       string `json:"notes"`
		Deadline    int64  `json:"deadline"`
		Complete    bool   `json:"complete"`
	}

	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}
	if int(s.Data.UserID) != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}
	taskID, err := strconv.ParseInt(r.PathValue("task_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse taskID"))
		return
	}

	var req taskRequestBody
	err = json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}

	task, err := cfg.db.UpdateTask(r.Context(), database.UpdateTaskParams{
		ID:          taskID,
		Title:       req.Title,
		Description: req.Description,
		Notes:       req.Notes,
		Priority:    req.Priority,
		Deadline:    req.Deadline,
		Complete:    req.Complete,
	})

	if err != nil {
		errorResponse(w, 500, errors.New("failed to update project"))
		return
	}

	jsonResponse(w, 200, task)
}

func (cfg *apiConfig) HandleDeleteTask(w http.ResponseWriter, r *http.Request, s *session.Session) {
	id, err := strconv.ParseInt(r.PathValue("task_id"), 10, 64)
	if err != nil {
		errorResponse(w, 500, err)
	}
	err = cfg.db.DeleteTask(r.Context(), database.DeleteTaskParams{
		ID:     id,
		UserID: s.Data.UserID,
	})
	if err != nil {
		errorResponse(w, 500, err)
	}
	jsonResponse(w, 200, struct{ Message string }{Message: "success"})
}
