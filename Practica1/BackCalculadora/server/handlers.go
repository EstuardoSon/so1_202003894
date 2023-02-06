package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Operacion struct {
	Num1  int64
	Num2  int64
	Signo string
	Fecha time.Time
}

func conectDataBase() (*sql.DB, error) {
	connectionString := "root:password@tcp(localhost:3306)/DBCalculadora?parseTime=True"
	db, err := sql.Open("mysql", connectionString)

	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func queryOperacion(w *http.ResponseWriter, ctx context.Context, db *sql.DB) error {
	qry := "select * from Operacion;"

	rows, err := db.QueryContext(ctx, qry)
	if err != nil {
		return err
	}

	operaciones := []Operacion{}

	for rows.Next() {
		op := Operacion{}

		err := rows.Scan(&op.Num1, &op.Num2, &op.Signo, &op.Fecha)
		if err != nil {
			return err
		}

		operaciones = append(operaciones, op)
	}
	json.NewEncoder(*w).Encode(operaciones)

	return nil
}

func index(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	if r.Method == "GET" {
		db, err := conectDataBase()

		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		errs := queryOperacion(&w, ctx, db)

		if errs != nil {
			panic(errs)
		}
		db.Close()
		return
	}
}
