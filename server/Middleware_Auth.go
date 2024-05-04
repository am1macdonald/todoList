package main

import (
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/database"
)

type authenticatedHandler func(w http.ResponseWriter, r *http.Request, u *database.User)

func MiddlewareAuth(next authenticatedHandler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := &database.User{}
		next(w, r, u)
	})
}
