package main

import (
	"errors"
	"log"
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/user"
)

func (cfg *apiConfig) HandleMagicLink(w http.ResponseWriter, r *http.Request) {
	ss := r.URL.Query().Get("token")
	u, err := user.UserFromToken(ss)
	if err != nil {
		errorResponse(w, 400, errors.New("token is invalid"))
		return
	}
	log.Println(u)
	at, err := u.GetAccessToken()
	if err != nil {
		errorResponse(w, 500, errors.New("failed to create access token"))
		return
	}
	rt, err := u.GetRefreshToken()
	if err != nil {
		errorResponse(w, 500, errors.New("failed to create refresh token"))
		return
	}
	jsonResponse(w, 200, struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
	}{
		at,
		rt,
	})
}
