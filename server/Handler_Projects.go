package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/user"
	"github.com/am1macdonald/to-do-list/server/internal/user/project"
)

type projectRequestBody struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Notes       string `json:"notes"`
	Deadline    int64  `json:"deadline"`
	Complete    bool   `json:"complete"`
}

func DbProjectToProject(p *database.Project) *project.Project {
	return &project.Project{
		ID:          p.ID,
		UserID:      p.UserID,
		Title:       p.Title,
		Description: p.Description,
		Notes:       p.Notes,
		Deadline:    p.Deadline,
		Complete:    p.Complete,
	}
}

func (cfg *apiConfig) HandleGetProjects(w http.ResponseWriter, r *http.Request, u *user.User) {
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}
	if u.ID != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}
	dbProj, err := cfg.db.GetUserProjects(r.Context(), userID)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to gather projects"))
		return
	}
	projects := make([]project.Project, len(dbProj))
	for _, p := range dbProj {
		projects = append(projects, *DbProjectToProject(&p))
	}
	jsonResponse(w, 200, projects)
}

func (cfg *apiConfig) HandleAddProject(w http.ResponseWriter, r *http.Request, u *user.User) {
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

	jsonResponse(w, 200, project)
}
