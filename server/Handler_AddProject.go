package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
)

func (cfg *apiConfig) HandleAddProject(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Notes       string `json:"notes"`
		Deadline    int64  `json:"deadline"`
		Complete    bool   `json:"complete"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}
	jsonResponse(w, 200, req)
}
