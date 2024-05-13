package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/task"
	"github.com/am1macdonald/to-do-list/server/internal/user"
)

func DbTaskToTask(p *database.Task) *task.Task {
	return &task.Task{
		ID:          p.ID,
		UserID:      p.UserID,
		Title:       p.Title,
		Description: p.Description,
		Notes:       p.Notes,
		Priority:    p.Priority,
		Checklist:   p.Checklist,
		Deadline:    p.Deadline,
		Complete:    p.Complete,
	}
}

func (cfg *apiConfig) HandleGetTasks(w http.ResponseWriter, r *http.Request, u *user.User) {
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}
	if u.ID != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}
	dbTasks, err := cfg.db.GetUserTasks(r.Context(), userID)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to gather projects"))
		return
	}
	tasks := make([]task.Task, len(dbTasks))
	for i, t := range dbTasks {
		tasks[i] = *DbTaskToTask(&t)
	}
	jsonResponse(w, 200, tasks)
}

func (cfg *apiConfig) HandleAddTask(w http.ResponseWriter, r *http.Request, u *user.User) {
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

func (cfg *apiConfig) HandleUpdateTask(w http.ResponseWriter, r *http.Request, u *user.User) {
	type taskRequestBody struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Priority    int64  `json:"priority"`
		Checklist   string `json:"checklist"`
		Notes       string `json:"notes"`
		Deadline    int64  `json:"deadline"`
		Complete    bool   `json:"complete"`
	}

	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}
	if u.ID != int(userID) {
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
		Checklist:   req.Checklist,
		Deadline:    req.Deadline,
		Complete:    req.Complete,
	})

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to update project"))
		return
	}

	jsonResponse(w, 200, task)
}
