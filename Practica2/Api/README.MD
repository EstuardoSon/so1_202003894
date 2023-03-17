# API
Este apartado contiene la conexion con la base de datos para obtener un json con la informacion del CPU, RAM y los procesos que se ejecutan.


## index.js
Este archivo contiene las funciones que se ejecutan al acceder a los endpoints. Depende del archivo database.js para la conexion a la base de datos.

```
// Importe de librerias para el funcionamiento 
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')

// Importe de la funcion getConnection del archivo database.js
const { getConnection } = require("./database/database");

// Designar el puerto para ejecutar la api 
app.set("port", 3001);

// Cambiar los ajustes default de la api e incluir CORS
app.use(cors())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Creacion del endpoint / 
app.get("/", async (req, res) => {
  try {
    const connection = getConnection();
    const result = await connection.query(
      `call General(@running,@sleeping,@stopped,@zombie,@total,@cpu,@ram);`
    );
    
    let json = "{\n"
    json += `"General":{\n`

    const [result2,fields] = await connection.query(
      `select @running as RUNNING,@sleeping as SLEEPING,@stopped as STOPPED,@zombie as ZOMBIE,@total as TOTAL,@cpu as CPU, @ram as RAM;`
    );

    json += `"RUNNING":${result2[0].RUNNING},\n`
    json += `"STOPPED":${result2[0].STOPPED},\n`
    json += `"SLEEPING":${result2[0].SLEEPING},\n`
    json += `"ZOMBIE":${result2[0].ZOMBIE},\n`
    json += `"CPU":${result2[0].CPU},\n`
    json += `"RAM":${result2[0].RAM},\n`
    json += `"TOTAL":${result2[0].TOTAL}\n`
    json += `},\n`
    json += `"Procesos":[\n`

    const [[result3,fields3],fields2] = await connection.query(`call getProcess();`);
    
    for (let proceso of result3){
        json += `{"Pid":${proceso.Pid}, "Nombre":"${proceso.Nombre}", "Estado":"${proceso.Estado}", "Usuario":"${proceso.Usuario}", "Ram":${proceso.Ram},"Threads":[\n`
        await connection.query(`call getThreads(${proceso.Pid});`).then(([[res,fields3],fields2]) => {
            for (let thread of res){
                json += `{"Pid":${thread.Pid}, "Tpid":"${thread.Tpid}", "Nombre":"${thread.Nombre}"},\n`
            }        
        })
        json += `]\n},\n`
    }
    json += "]\n"
    json += "}\n"
    res.json(JSON.parse(json.replaceAll("},\n]","}\n]")));

  } catch (e) {
    res.status(500);
    console.log(e.message);
  }
});

// Ejecutar la API
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

```

## database.js
Este archivo contiene la informacion y la funcion para conectar a la base de datos.

```
const mysql = require("mysql2");
require('dotenv').config();

// Establecer los datos de la base de datos 
const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD
});

// Creacion de la funcion getConnection
const getConnection = () => {
    return connection.promise();
}

// Exportar la funcion getConnection
module.exports = {
    getConnection
}
```