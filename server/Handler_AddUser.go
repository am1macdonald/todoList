package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/am1macdonald/to-do-list/server/internal/database"
)

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
	dbUser, err := cfg.db.CreateUser(r.Context(), database.CreateUserParams{
		Name:  req.Name,
		Email: req.Email,
	})
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			jsonResponse(w, 400, "user already exists")
			return
		}
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to create user"))
		return
	}
	u := DbUserToUser(&dbUser)
	ss, err := u.GetLoginToken()
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("can't get user token"))
		return
	}
	cfg.mailer.SendMessage("MagicLink for 'DO.'", os.Getenv("HOSTNAME")+r.URL.Path+"?token="+ss, u.Email)
	jsonResponse(w, 200, "success")
	return
}
