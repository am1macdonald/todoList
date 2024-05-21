package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/session"
)

type authenticatedHandler func(w http.ResponseWriter, r *http.Request, s *session.Session)

func (cfg *apiConfig) MiddlewareAuthenticate(next authenticatedHandler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionCookie, err := r.Cookie("session")
		if err != nil {
			jsonResponse(w, 400, "not signed in")
			return
		}

		str, err := (*cfg.cache).Do(r.Context(), (*cfg.cache).B().Get().Key(sessionCookie.Value).Build()).ToString()
		if err != nil {
			log.Println(err)
			errorResponse(w, 500, err)
			return
		}

		sd := &session.SessionData{}
		s := &session.Session{
			Key:  sessionCookie.Value,
			Data: sd,
		}

		err = json.Unmarshal([]byte(str), sd)

		if err != nil {
			log.Println(err)
			errorResponse(w, 500, err)
			return
		}

		if s.IsExpired() {
			jsonResponse(w, 400, "session is expired")
			return
		}

		next(w, r, s)
	})
}
