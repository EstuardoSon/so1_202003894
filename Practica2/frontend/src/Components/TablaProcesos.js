import React, { Component } from "react";

class TablaProcesos extends Component {
  state = {};
  render() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">PID</th>
            <th scope="col">NOMBRE</th>
            <th scope="col">USUARIO</th>
            <th scope="col">ESTADO</th>
            <th scope="col">%RAM</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.length
            ? this.props.data.map((proceso) => (
                <tr key={proceso.numero}>
                  <td>{proceso.pid}</td>
                  <td>{proceso.nombre}</td>
                  <td>{proceso.usuario}</td>
                  <td>{proceso.estado}</td>
                  <td>{proceso.ram}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    );
  }
}

export default TablaProcesos;
