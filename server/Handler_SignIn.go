package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/user"
)

func DbUserToUser(u *database.User) *user.User {
	return &user.User{
		ID:        int(u.ID),
		Name:      u.Name,
		Email:     u.Email,
		Created:   u.CreatedAt,
		Updated:   u.UpdatedAt,
		LastLogin: u.LastLogin,
	}
}

func (cfg *apiConfig) HandleSignIn(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to parse body"))
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
	dbUser, err := cfg.db.GetUserFromEmail(r.Context(), req.Email)
	if err != nil {
		errorResponse(w, 400, errors.New("user does not exist"))
		return
	}
	u := DbUserToUser(&dbUser)
	ss, err := u.GetLoginToken()
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("can't get user token"))
		return
	}
	jsonResponse(w, 200, os.Getenv("HOSTNAME")+r.URL.Path+"?token="+ss)
	return
}
