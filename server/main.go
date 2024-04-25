package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/joho/godotenv"
)

type apiConfig struct {

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
func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {

  mux := http.NewServeMux()
  
  mux.HandleFunc("POST /api/v1/users", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Adding new user")
    w.WriteHeader(200)

  })

  corsMux := middlewareCors(mux)
  server := http.Server{
    Addr: ":8080",
    Handler: corsMux,
  }
  log.Fatal(server.ListenAndServe())
}

