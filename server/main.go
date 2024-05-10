package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/am1macdonald/to-do-list/server/internal/mailer"
	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type apiConfig struct {
	db     *database.Queries
	mailer *mailer.Mailer
}

func middlewareCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func jsonResponse(w http.ResponseWriter, status int, payload interface{}) {
	val, err := json.Marshal(payload)
	if err != nil {
		log.Println(err)
		w.WriteHeader(500)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	w.Write(val)
}

func errorResponse(w http.ResponseWriter, status int, err error) {
	log.Println(err.Error())
	jsonResponse(w, status, err)
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	url := os.Getenv("DB_CONN")
	db, err := sql.Open("libsql", url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", url, err)
		os.Exit(1)
	}
	fmt.Println("Connected to database")

	defer db.Close()

	mailer := mailer.New()
	queries := database.New(db)

	cfg := apiConfig{
		db:     queries,
		mailer: mailer,
	}

	mux := http.NewServeMux()

	// users
	mux.HandleFunc("POST /api/v1/users", cfg.HandleAddUser)

	// sign in
	mux.HandleFunc("POST /api/v1/sign_in", cfg.HandleSignIn)
	mux.HandleFunc("GET /api/v1/sign_in", cfg.HandleMagicLink)

	// projects
	mux.HandleFunc("POST /api/v1/{user_id}/projects", MiddlewareAuthenticate(cfg.HandleAddProject))
	mux.HandleFunc("GET /api/v1/{user_id}/projects", func(w http.ResponseWriter, r *http.Request) {})
	mux.HandleFunc("PUT /api/v1/{user_id}/projects/{project_id}", func(w http.ResponseWriter, r *http.Request) {})

	corsMux := middlewareCors(mux)
	server := http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: corsMux,
	}
	log.Fatal(server.ListenAndServe())
}
