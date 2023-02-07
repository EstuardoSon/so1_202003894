package server

import "net/http"

func New() *http.ServeMux {
	mux := http.NewServeMux()
	initRoutes(mux)

	return mux
}
