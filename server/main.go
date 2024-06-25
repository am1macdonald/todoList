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
	"github.com/valkey-io/valkey-go"
)

type apiConfig struct {
	cache  *valkey.Client
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
	jsonResponse(w, status, struct{ Message string }{Message: "internal error"})
}

func init() {
	if os.Getenv("PRODUCTION") != "" {
		return
	}
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	// init cache
	client, err := valkey.NewClient(valkey.ClientOption{
		InitAddress: []string{os.Getenv("CACHE_CONN")},
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to session cache")

	// init db
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
		cache:  &client,
		mailer: mailer,
	}

	mux := http.NewServeMux()

	// users
	mux.HandleFunc("POST /api/v1/users", cfg.HandleAddUser)

	// sign in
	mux.HandleFunc("POST /api/v1/sign_in", cfg.HandleSignIn)
	mux.HandleFunc("GET /api/v1/sign_in", cfg.HandleMagicLink)

	// sign_out
	mux.HandleFunc("GET /api/v1/sign_out", cfg.MiddlewareAuthenticate(cfg.HandleSignOut))

	// session
	mux.HandleFunc("GET /api/v1/session", cfg.MiddlewareAuthenticate(cfg.HandleGetSession))

	// projects
	mux.HandleFunc("POST /api/v1/{user_id}/projects", cfg.MiddlewareAuthenticate(cfg.HandleAddProject))
	mux.HandleFunc("GET /api/v1/{user_id}/projects", cfg.MiddlewareAuthenticate(cfg.HandleGetProjects))
	mux.HandleFunc("PUT /api/v1/{user_id}/projects/{project_id}", cfg.MiddlewareAuthenticate(cfg.HandleUpdateProject))
	mux.HandleFunc("DELETE /api/v1/{user_id}/projects/{task_id}", cfg.MiddlewareAuthenticate(cfg.HandleDeleteProject))

	// tasks
	mux.HandleFunc("POST /api/v1/{user_id}/tasks", cfg.MiddlewareAuthenticate(cfg.HandleAddTask))
	mux.HandleFunc("GET /api/v1/{user_id}/tasks", cfg.MiddlewareAuthenticate(cfg.HandleGetTasks))
	mux.HandleFunc("PUT /api/v1/{user_id}/tasks/{task_id}", cfg.MiddlewareAuthenticate(cfg.HandleUpdateTask))
	mux.HandleFunc("DELETE /api/v1/{user_id}/tasks/{task_id}", cfg.MiddlewareAuthenticate(cfg.HandleDeleteTask))

	corsMux := middlewareCors(mux)
	server := http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: corsMux,
	}
	log.Fatal(server.ListenAndServe())
}
