# Backend
## main.go
Contiene la funcion main del programa para la creacion del servidor
```
#Se indica el paquete al que pertenece el archivo
package main

#Se importan las dependencias
import (
	"context"
	"database/sql" #Driver para realizar la conexion entre mysql y go
	"net/http"

	"github.com/EstuardoSon/server"
	"github.com/rs/cors"
)

#Funcion para verificar la conexion con la base de datos, no es utilizada en esta area sino en el archivo handlers.go
func consultaDataBase(ctx context.Context, db *sql.DB) error {
	return nil
}

#Funcion main encargada de crear el servidor y dar permisos cors
func main() {
	mux := server.New()

	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}
```

## Server.go
```
#Se define el paquete al cual pertenece el archivo
package server

#Se importan las dependencias
import "net/http"

#Funcion encargada de crear el servidor estableciendo los endpoints que utilizara
func New() *http.ServeMux {
	mux := http.NewServeMux()
	initRoutes(mux)

	return mux
}
```

## routes.go
Archivo que contiene los endpoints del servidor
```
#Se establece el parquete al que pertenece el servidor
package server

#Se importan las dependencias
import "net/http"

#Funcion encargada de inicializar las rutas e indicar que funcion se ejecutara con cada endpoint
func initRoutes(mux *http.ServeMux) {
	(*mux).HandleFunc("/", index)
}
```
## handler.go
Archivo que contiene todas las funciones que se ejecutaran una vez que se alla accedido al su endpoint correspondiente
```
#Se especifica el paquete al que pertenece el archivo
package server

#Se importan las dependencias
import (
	"context"
	"database/sql" #Driver para realizar la conexion entre mysql y go
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

#Se define el struct Operacion
type Operacion struct {
	Num1      int
	Num2      int
	Signo     string
	Resultado string
	Fecha     time.Time
}

#Se define el struct resultado
type resultado struct {
	Resultado string
}

#Se define el struct OperacionS
type OperacionS struct {
	Operacion string
}

#Funcion encargada de verificar que se pueda realizar la conexion con la base de datos
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

#Funcion encargada de realizar la solicitud SELECT a la base de datos
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

#Funcion encargada de realizar un Insert Into en la base de datos
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

#Funcion que se acciona al acceder al endpoint "/"
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
```
---
# Dockerfile
```
FROM golang:1.20 as backend

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/app ./main.go

EXPOSE 8080

CMD ["app"]
```
- La imagen utilizada para el contenedro es golang:1.20
- Se establece el area de trabajo en la ruta */usr/src/app* del contenedor
- se copian los archivos go.mod y go.sum dentro de la ruta */usr/src/app*
- Se ejecuta el comando go mod dowload  y go mod verify para descargar las dependencias necesarias para la ejecucion
- Se copian los archivos del proyecto dentro de la carpeta */usr/src/app*
- Se ejecuta el comando go build para crear el ejecutable del programa
- Se expone el puerto 8080 del contenedor
- Se ejecuta la aplicacion