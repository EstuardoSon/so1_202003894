import { useState, useEffect } from "react";
import "./App.css";
import GraficaPie from "./Components/GraficaPie";
import TablaProcesos from "./Components/TablaProcesos";
import TablaIG from "./Components/TablaIG";

function App() {
  const [tablas, setTablas] = useState({
    General: [
      { texto: "Proceso en Ejecucion", valor: 0 },
      { texto: "Proceso Suspendidos", valor: 0 },
      { texto: "Proceso Detenidos", valor: 0 },
      { texto: "Proceso Zombie", valor: 0 },
      { texto: "Total de Procesos", valor: 0 },
    ],
    Procesos: [],
  });

  const [dataCPU, setCPU] = useState({
    labels: ["Usado", "No Usado"],
    datasets: [
      {
        label: "Grafica CPU",
        data: [0, 100],
        backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
      },
    ],
  });

  const [dataRAM, setRam] = useState({
    labels: ["Usado", "No Usado"],
    datasets: [
      {
        label: "Grafica CPU",
        data: [0, 100],
        backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
      },
    ],
  });

  useEffect(() => {
    const metodoGET = setInterval(() => {
      fetch("http://localhost:3001/")
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          setTablas({
            General: [
              { texto: "Proceso en Ejecucion", valor: res.General.RUNNING },
              { texto: "Proceso Suspendidos", valor: res.General.SLEEPING },
              { texto: "Proceso Detenidos", valor: res.General.STOPPED },
              { texto: "Proceso Zombie", valor: res.General.ZOMBIE },
              { texto: "Total de Procesos", valor: res.General.TOTAL },
            ],
            Procesos: res.Procesos,
          });
          setCPU({
            labels: ["Usado", "No Usado"],
            datasets: [
              {
                label: "Grafica CPU",
                data: [res.General.CPU, 100 - res.General.CPU],
                backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
              },
            ],
          });
          setRam({
            labels: ["Usado", "No Usado"],
            datasets: [
              {
                label: "Grafica RAM",
                data: [res.General.RAM, 100 - res.General.RAM],
                backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
              },
            ],
          });
        });
    }, 3000);
    return () => clearInterval(metodoGET);
  }, []);

  return (
    <div className="App">
      <div>
        <h3>Estuardo Gabriel Son Mux</h3>
        <p className="text-muted">202003894</p>
      </div>
      <div className="row m-4">
        <div className="col-md-3"></div>
        <div
          className="col-md-2 m-2 rounded border border-dark table-responsive"
          style={{ backgroundColor: "#1b1b1f" }}
        >
          <TablaIG data={tablas.General} />
        </div>
        <div
          className="col-md-4 m-2 rounded border border-dark"
          style={{ backgroundColor: "#1b1b1f" }}
        >
          <div className="row">
            <GraficaPie nombre="Grafica CPU" dataPie={dataCPU} />
            <GraficaPie nombre="Grafica RAM" dataPie={dataRAM} />
          </div>
        </div>
      </div>
      <div className="row m-4">
        <div className="col-md-3"></div>
        <div
          className="col-md-6 m-2 rounded border border-dark table-responsive"
          style={{ backgroundColor: "#1b1b1f" }}
        >
          <TablaProcesos data={tablas.Procesos} />
        </div>
      </div>
    </div>
  );
}

export default App;
