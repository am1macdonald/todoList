package main

import (
	"net/http"
	"strings"

	"github.com/am1macdonald/to-do-list/server/internal/user"
)

type authenticatedHandler func(w http.ResponseWriter, r *http.Request, u *user.User)

func MiddlewareAuthenticate(next authenticatedHandler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t := r.Header.Get("Authorization")
		if t == "" {
			jsonResponse(w, 400, "authorization header is required")
			return
		}
		token := strings.Split(t, " ")
		if len(token) < 2 || strings.ToLower(token[0]) != "bearer" {
			jsonResponse(w, 400, "authorization is invalid")
			return
		}
		u, issuer, err := user.UserFromToken(token[1])
		if err != nil || strings.ToLower(issuer) != "passporter_access" {
			jsonResponse(w, 400, "token is invalid")
			return
		}
		next(w, r, u)
	})
}
