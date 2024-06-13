package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/project"
	"github.com/am1macdonald/to-do-list/server/internal/session"
)

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

func (cfg *apiConfig) HandleGetProjects(w http.ResponseWriter, r *http.Request, s *session.Session) {
	userID, err := strconv.ParseInt(r.PathValue("user_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse userID"))
		return
	}
	if int(s.Data.UserID) != int(userID) {
		jsonResponse(w, 401, "unauthorized")
		return
	}
	dbProj, err := cfg.db.GetUserProjects(r.Context(), userID)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to gather projects"))
		return
	}
	projects := make([]project.Project, len(dbProj))
	for i, p := range dbProj {
		projects[i] = *DbProjectToProject(&p)
	}
	jsonResponse(w, 200, projects)
}

func (cfg *apiConfig) HandleAddProject(w http.ResponseWriter, r *http.Request, s *session.Session) {
	type projectRequestBody struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Notes       string `json:"notes"`
		Deadline    string `json:"deadline"`
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

func (cfg *apiConfig) HandleUpdateProject(w http.ResponseWriter, r *http.Request, s *session.Session) {
	type projectRequestBody struct {
		Title       string  `json:"title"`
		Description string  `json:"description"`
		Notes       string  `json:"notes"`
		Deadline    string  `json:"deadline"`
		Complete    bool    `json:"complete"`
		Tasks       []int64 `json:"tasks"`
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
	projectID, err := strconv.ParseInt(r.PathValue("project_id"), 10, 64)
	if err != nil {
		jsonResponse(w, 500, errors.New("failed to parse projectID"))
		return
	}

	var req projectRequestBody
	err = json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}

	log.Println(req.Tasks)

	err = cfg.db.SetTaskProject(r.Context(), database.SetTaskProjectParams{
		UserID: userID,
		ProjectID: sql.NullInt64{
			Valid: true,
			Int64: projectID,
		},
		Ids: req.Tasks,
	})

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to update project"))
		return
	}

	project, err := cfg.db.UpdateProject(r.Context(), database.UpdateProjectParams{
		ID:          projectID,
		Title:       req.Title,
		Description: req.Description,
		Notes:       req.Notes,
		Deadline:    req.Deadline,
		Complete:    req.Complete,
	})

	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to update project"))
		return
	}

	jsonResponse(w, 200, project)
}

func (cfg *apiConfig) HandleDeleteProject(w http.ResponseWriter, r *http.Request, s *session.Session) {
	id, err := strconv.ParseInt(r.PathValue("task_id"), 10, 64)
	if err != nil {
		errorResponse(w, 500, err)
	}
	err = cfg.db.DeleteProject(r.Context(), database.DeleteProjectParams{
		ID:     id,
		UserID: s.Data.UserID,
	})
	if err != nil {
		errorResponse(w, 500, err)
	}
	jsonResponse(w, 200, struct{ Message string }{Message: "success"})
}
