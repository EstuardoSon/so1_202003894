import React, { Component } from "react";

class TablaLogs extends Component {
  render() {
    var n = 0
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Numero 1</th>
            <th scope="col">Numero 2</th>
            <th scope="col">Simbolo</th>
            <th scope="col">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {
          this.props.Operaciones.length
            ? this.props.Operaciones.map((operacion) => (
                <tr key={++n} className="table-active">
                  <td>{operacion.Num1}</td>
                  <td>{operacion.Num2}</td>
                  <td>{operacion.Signo}</td>
                  <td>{operacion.Fecha}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    );
  }
}

export default TablaLogs;
