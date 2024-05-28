package main

import (
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/session"
)

func (c *apiConfig) HandleGetSession(w http.ResponseWriter, r *http.Request, s *session.Session) {
	jsonResponse(w, 200, struct {
		UserID   int    `json:"userID"`
		Username string `json:"username"`
	}{
		UserID:   int(s.Data.UserID),
		Username: s.Data.Username,
	})
}
