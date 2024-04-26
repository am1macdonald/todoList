package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/am1macdonald/to-do-list/server/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type apiConfig struct {
	db *database.Queries
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

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	url := os.Getenv("DB_CONN") + "?authToken=" + os.Getenv("DB_TOKEN")
	db, err := sql.Open("libsql", url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", url, err)
		os.Exit(1)
	}
	fmt.Println("Connected to database")

	defer db.Close()

	queries := database.New(db)
	cfg := apiConfig{
		db: queries,
	}

	mux := http.NewServeMux()


	corsMux := middlewareCors(mux)
	server := http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: corsMux,
	}
	log.Fatal(server.ListenAndServe())
}
