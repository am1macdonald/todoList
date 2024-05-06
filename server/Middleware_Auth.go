package main

import (
	"net/http"

	"github.com/am1macdonald/to-do-list/server/internal/database"
)

type authenticatedHandler func(w http.ResponseWriter, r *http.Request, u *database.User)

func MiddlewareAuthenticate(next authenticatedHandler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := &database.User{}
		next(w, r, u)
	})
}

func MiddlewareAuthorize(next authenticatedHandler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := &database.User{}
		next(w, r, u)
	})
}
