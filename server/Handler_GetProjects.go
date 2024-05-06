package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/project"
)

func DbProjectToProject(u *database.User) *project.Project {
	return &project.Project{}
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
