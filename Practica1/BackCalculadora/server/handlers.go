package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Operacion struct {
	Num1      int
	Num2      int
	Signo     string
	Resultado string
	Fecha     time.Time
}

type resultado struct {
	Resultado string
}

type OperacionS struct {
	Operacion string
}

func conectDataBase() (*sql.DB, error) {
	connectionString := "root:password@tcp(database:3306)/DBCalculadora?parseTime=True"
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
	filetext := ""

	for rows.Next() {
		op := Operacion{}

		err := rows.Scan(&op.Num1, &op.Num2, &op.Signo, &op.Resultado, &op.Fecha)
		if err != nil {
			return err
		}

		operaciones = append(operaciones, op)
		filetext += strconv.Itoa(op.Num1) + " " + strconv.Itoa(op.Num2) + " " + op.Signo + " " + op.Resultado + " " + op.Fecha.String() + "\n"
	}
	file, err := os.Create("./Reporte/Reporte.txt")
	if err != nil {
		fmt.Println(err.Error())
	} else {
		defer file.Close()
		_, err = file.WriteString(filetext)

		if err != nil {
			fmt.Println(err.Error())
		}
	}

	json.NewEncoder(*w).Encode(operaciones)

	return nil
}

func queryIngresar(w *http.ResponseWriter, ctx context.Context, db *sql.DB, operacion string) error {
	num1 := ""
	num2 := ""
	simbolo := ""
	fecha := time.Now()
	bandera := false
	resultado := resultado{}
	resultado.Resultado = "Error"

	for i := 0; i < len(operacion); i++ {
		if !bandera {
			if operacion[i] >= 48 && operacion[i] <= 57 {
				num1 += string(operacion[i])
			} else {
				simbolo = string(operacion[i])
				bandera = true
			}
		} else {
			if operacion[i] >= 48 && operacion[i] <= 57 {
				num2 += string(operacion[i])
			}
		}
	}

	num1I, err := strconv.Atoi(num1)
	if err != nil {
		json.NewEncoder(*w).Encode(resultado)
		return err
	}
	num2I, err := strconv.Atoi(num2)
	if err != nil {
		json.NewEncoder(*w).Encode(resultado)
		return err
	}

	resultadoI := 0
	if simbolo == "+" {
		resultadoI = num1I + num2I
		resultado.Resultado = strconv.Itoa(resultadoI)
	} else if simbolo == "-" {
		resultadoI = num1I - num2I
		resultado.Resultado = strconv.Itoa(resultadoI)
	} else if simbolo == "*" {
		resultadoI = num1I * num2I
		resultado.Resultado = strconv.Itoa(resultadoI)
	} else if simbolo == "/" && num2I != 0 {
		resultadoI = num1I / num2I
		resultado.Resultado = strconv.Itoa(resultadoI)
	}

	qry := `insert into Operacion values (?,?,?,?,?);`

	_, errQ := db.ExecContext(ctx, qry, num1I, num2I, simbolo, resultado.Resultado, fecha)

	if errQ != nil {
		json.NewEncoder(*w).Encode(resultado)
		return errQ
	}

	json.NewEncoder(*w).Encode(resultado)

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
	} else if r.Method == "POST" {
		db, err := conectDataBase()

		if err != nil {
			panic(err)
		}

		operacion := &OperacionS{}
		err = json.NewDecoder(r.Body).Decode(operacion)

		if err != nil {
			panic(err)
		} else {
			w.Header().Set("Content-Type", "application/json")
			err = queryIngresar(&w, ctx, db, operacion.Operacion)

			if err != nil {
				panic(err)
			}
		}
		db.Close()
		return
	}
}
