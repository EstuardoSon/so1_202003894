package main

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/EstuardoSon/server"
	"github.com/rs/cors"
)

func consultaDataBase(ctx context.Context, db *sql.DB) error {
	return nil
}

func main() {
	mux := server.New()

	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}
