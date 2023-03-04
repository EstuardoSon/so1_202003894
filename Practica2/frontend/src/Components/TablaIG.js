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
