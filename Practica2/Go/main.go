package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os/exec"
	"os/user"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func conectDataBase() (*sql.DB, error) {
	connectionString := "root:password@tcp(monitordb:3306)/Monitor"
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

type Thread struct {
	Pid    int
	Tpid   int
	Nombre string
}

type Proceso struct {
	Pid     int
	Nombre  string
	Usuario uint32
	Estado  string
	Ram     int
	Threads []Thread
}

type MonitorCPU struct {
	Procesos []Proceso
	CPU      int
}

type Ram struct {
	Ram int
}

func queryVaciar(ctx context.Context, db *sql.DB) error {
	qry := `call clearData();`

	_, err := db.ExecContext(ctx, qry)

	if err != nil {
		return err
	}

	return nil
}

func queryIngresarProceso(p Proceso, ctx context.Context, db *sql.DB) error {
	u, err := user.LookupId(fmt.Sprint(p.Usuario))
	usuario := "Desconocido"
	if err != nil {
		fmt.Println(err)
	} else {
		usuario = u.Username
	}
	qry := `call setProcess(?,?,?,?,?);`

	_, err = db.ExecContext(ctx, qry, p.Pid, p.Nombre, usuario, p.Estado, p.Ram)

	if err != nil {
		return err
	}

	return nil
}

func queryIngresarThread(t Thread, ctx context.Context, db *sql.DB) error {
	qry := `call setThread(?,?,?);`

	_, err := db.ExecContext(ctx, qry, t.Pid, t.Tpid, t.Nombre)

	if err != nil {
		return err
	}

	return nil
}

func queryIngresarRend(cpu int, ram int, ctx context.Context, db *sql.DB) error {
	qry := `call setRendimiento(?,?);`

	_, err := db.ExecContext(ctx, qry, cpu, ram)

	if err != nil {
		return err
	}

	return nil
}

func main() {
	for {
		db, err := conectDataBase()
		if err != nil {
			panic(err)
		}

		//Json RAM
		cmd := exec.Command("sh", "-c", "cat /proc/ram_202003894")
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
		}

		var ram Ram

		output := string(out[:])

		err = json.Unmarshal([]byte(output), &ram)

		if err != nil {
			panic(err)
		}

		//Json CPU
		cmd = exec.Command("sh", "-c", "cat /proc/cpu_202003894")
		out, err = cmd.CombinedOutput()
		if err != nil {
			panic(err)
		}

		var moduloCPU MonitorCPU
		output = string(out[:])

		err = json.Unmarshal([]byte(strings.Replace(output, ",\n]", "\n]", -1)), &moduloCPU)

		if err != nil {
			panic(err)
		}

		ctx := context.Background()

		err = queryVaciar(ctx, db)
		if err != nil {
			panic(err)
		}

		err = queryIngresarRend(moduloCPU.CPU, ram.Ram, ctx, db)
		if err != nil {
			panic(err)
		}

		for _, p := range moduloCPU.Procesos {
			err = queryIngresarProceso(p, ctx, db)
			if err != nil {
				panic(err)
			}

			for _, t := range p.Threads {
				err = queryIngresarThread(t, ctx, db)
				if err != nil {
					panic(err)
				}
			}
		}

		db.Close()

		fmt.Println("PROCESO COMPLETADO")
		time.Sleep(5 * time.Second)
	}
}
