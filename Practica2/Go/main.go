package main

import (
	"net/http"

	"github.com/EstuardoSon/api/server"
	"github.com/rs/cors"
)

func main() {
	mux := server.New()

	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}
