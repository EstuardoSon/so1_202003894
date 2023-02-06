package main

import (
	"context"
	"database/sql"
	"os"
	"os/signal"
	"syscall"

	"github.com/EstuardoSon/server"
)

func consultaDataBase(ctx context.Context, db *sql.DB) error {
	return nil
}

func main() {
	ctx := context.Background()
	serverDone := make(chan os.Signal, 1)
	signal.Notify(serverDone, os.Interrupt, syscall.SIGTERM)

	srv := server.New(":8080")

	go srv.ListenAndServe()

	<-serverDone

	srv.Shutdown(ctx)
}
