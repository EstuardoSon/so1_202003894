package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
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
	fmt.Println("DATOS OBTENIDOS DESDE EL MODULO :")
	fmt.Println("")

	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202003894")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	output := string(out[:])
	fmt.Println(output)
}
