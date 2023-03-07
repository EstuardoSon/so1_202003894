package server

import "net/http"

func initRoutes(mux *http.ServeMux) {
	(*mux).HandleFunc("/", index)
}
