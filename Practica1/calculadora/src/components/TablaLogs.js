import React, { Component } from "react";
import Axios from "axios";

class TablaLogs extends Component {
  state = {
    operaciones: [],
  };

  componentDidMount = () => {
    Axios.get("http://localhost:8080/")
      .then((response) => {
        this.setState({
          operaciones: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { operaciones } = this.state;
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
          operaciones.length
            ? operaciones.map((operacion) => (
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
