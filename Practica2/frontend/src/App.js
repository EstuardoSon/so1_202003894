import { useState } from "react";
import "./App.css";
import GraficaPie from "./Components/GraficaPie";
import TablaProcesos from "./Components/TablaProcesos";
import TablaIG from "./Components/TablaIG";
import json from "./json";

function App() {
  const [dataCPU] = useState({
    labels: ["Usado", "No Usado"],
    datasets: [
      {
        label: "Grafica CPU",
        data: [33.33, 25],
        backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
      },
    ],
  });

  const [dataRAM] = useState({
    labels: ["Usado", "No Usado"],
    datasets: [
      {
        label: "Grafica CPU",
        data: [75, 25],
        backgroundColor: ["rgb(27,57,157)", "rgb(66,70,79)"],
      },
    ],
  });

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
          <TablaIG data={[
            { texto: "Proceso en Ejecucion", valor: 0 },
            { texto: "Proceso Suspendidos", valor: 1 },
            { texto: "Proceso Detenidos", valor: 1 },
            { texto: "Proceso Zombie", valor: 1 },
            { texto: "Total de procesos", valor: 1 }
            ]} />
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
          <TablaProcesos data={json.Procesos} />
        </div>
      </div>
    </div>
  );
}

export default App;
