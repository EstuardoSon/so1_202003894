const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')
const { getConnection } = require("./database/database");

app.set("port", 3001);

app.use(cors())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      `call General(@running,@sleeping,@stopped,@zombie,@total,@cpu,@ram);`
    );

    let json = "{\n"
    json += `"General":{\n`

    const result2 = await connection.query(
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

    const result3 = await connection.query(`call getProcess();`);
    
    for (let proceso of result3[0]){
        json += `{"Pid":${proceso.Pid}, "Nombre":"${proceso.Nombre}", "Estado":"${proceso.Estado}", "Usuario":${proceso.Usuario}, "Ram":${proceso.Ram},"Threads":[\n`
        await connection.query(`call getThreads(${proceso.Pid});`).then((res) => {
            for (let thread of res[0]){
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

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
