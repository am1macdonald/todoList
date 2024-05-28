package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/am1macdonald/to-do-list/server/internal/session"
)

func (cfg *apiConfig) HandleSignOut(w http.ResponseWriter, r *http.Request, s *session.Session) {
	err := (*cfg.cache).Do(r.Context(), (*cfg.cache).B().Del().Key(s.Key).Build()).Error()
	if err != nil {
		log.Println(err)
		errorResponse(w, 500, errors.New("failed to remove session"))
	}

	session_cookie := http.Cookie{
		Name:     "session",
		Value:    s.Key,
		Domain:   os.Getenv("SERVICE_HOSTNAME"),
		Expires:  time.Now().Add(time.Hour * -24),
		MaxAge:   24 * 60 * 60,
		HttpOnly: true,
	}
	http.SetCookie(w, &session_cookie)
	http.Redirect(w, r, "/", http.StatusPermanentRedirect)
}
