package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/user"
)

func DbProjectToProject(u *database.User) {
}

func (cfg *apiConfig) HandleGetProjects(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}
	jsonResponse(w, 200, "success")
}

func (cfg *apiConfig) HandleAddProject(w http.ResponseWriter, r *http.Request, u *user.User) {
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Notes       string `json:"notes"`
		Deadline    int64  `json:"deadline"`
		Complete    bool   `json:"complete"`
	}

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
		Deadline:    time.Unix(req.Deadline, 0),
		Complete:    req.Complete,
	})

	jsonResponse(w, 200, project)
}
