package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/am1macdonald/to-do-list/server/internal/session"
	"github.com/am1macdonald/to-do-list/server/internal/user"
)

func (cfg *apiConfig) HandleMagicLink(w http.ResponseWriter, r *http.Request) {
	ss := r.URL.Query().Get("token")
	u, issuer, err := user.UserFromToken(ss)
	if err != nil || strings.ToLower(issuer) != "passporter_login" {
		log.Println(err)
		errorResponse(w, 400, errors.New("token is invalid"))
		return
	}
	log.Println(u)
	s, err := session.New(u.ID)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to init session"))
		return
	}
	cookie := http.Cookie{
		Name:     "session",
		Value:    s.Key,
		Domain:   os.Getenv("HOSTNAME"),
		MaxAge:   24 * 60 * 60,
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)
	w.WriteHeader(200)
	return
}
