package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"

	"github.com/am1macdonald/to-do-list/server/internal/database"
)

func valid(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (cfg *apiConfig) HandleAddUser(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
		return
	}
	if req.Name == "" {
		errorResponse(w, 400, errors.New("name is required"))
		return
	}
	if req.Email == "" {
		errorResponse(w, 400, errors.New("email is required"))
		return
	}
	if !valid(req.Email) {
		errorResponse(w, 400, errors.New("email is invalid"))
		return
	}
	_, err = cfg.db.CreateUser(r.Context(), database.CreateUserParams{
		Name:  req.Name,
		Email: req.Email,
	})
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to create user"))
		return
	}
	w.WriteHeader(200)
	return
}
