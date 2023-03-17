# Informacion General
La aplicacion esta elaborada con docker sin embargo esta es desplegada con docker en la base en docker.
La misma cuenta de 3 componentes para su funcionamiento a parte del componente principal App.js

## App.js
En este componente se establecen los estado padres que serviran para trasladar la informacion a los compenentes hijos. Es en este mismo en el que se realiza las solicitudes http para la obtencion de la informacion de la base de datos.

### Estados RAM y CPU
Estos estados se utilizan para ingresar la informacion dentro de las graficas de pie.

```
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
```

### Estado tablas
En este estado se almacena la informacion de los procesos que se ejecutan y sus hijos, asi mismo, se almacena la informacion de la cantidad de procesos en cada uno de sus estados.

```
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
```

### 

### Solicitud GET
```
// Funcion que se repite cada 3 segundos con la que se hace la solicitud GET a la api de nodejs
useEffect(() => {
    const metodoGET = setInterval(() => {
      fetch("/monitorapi/")
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);

          // Insercion de datos en el estado Tablas
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

          // Insercion de datos en el estado CPU
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

          // Insercion de datos en el estado RAM
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
```

## GraficaPie.js
Este componente se utiliza para la creacion de las graficas de Pie que mostraran el porcentaje utilizado de RAM y CPU.

```
import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

class GraficaCPU extends Component {
  state = {};
  render() {
    return (
      <div className="p-3 col-md-6">
        <h4>{this.props.nombre}</h4>
        <Doughnut data={this.props.dataPie} />
      </div>
    );
  }
}

export default GraficaCPU;
```

## TablaIG.js
En este componente se crea la tabla con la informacion general de la cantidad de procesos en cada uno de sus estados.

```
import React, { Component } from "react";

class TablaIG extends Component {
  state = {};
  render() {
    let n = 0;
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">INFORMACION</th>
            <th scope="col">VALOR</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((info) => (
            <tr key={n++}>
              <th scope="row">{info.texto}</th>
              <td>{info.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TablaIG;
```

## TablaProcesos.js
En este componente se crea un menu desplegable que servira a modo de arbol para mostrar los componentes padres y sus hijos.