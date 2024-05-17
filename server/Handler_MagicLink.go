package main

import (
	"encoding/json"
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
		errorResponse(w, 400, errors.New("token is invalid"))
		return
	}
	log.Println(u)
	s := session.New(u.ID)
	json, err := json.Marshal(s.Data)
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to create session"))
	}
	res, err := (*cfg.cache).Do(r.Context(), (*cfg.cache).B().Set().Key(s.Key).Value(string(json)).Build()).ToString()
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to set session"))
	}
	log.Println(res)
	session_cookie := http.Cookie{
		Name:     "session",
		Value:    s.Key,
		Domain:   "localhost",
		MaxAge:   24 * 60 * 60,
		HttpOnly: true,
	}
	log.Println(os.Getenv("SERVICE_HOSTNAME"))
	log.Println(s.Key)
	http.SetCookie(w, &session_cookie)
	w.WriteHeader(200)
}
