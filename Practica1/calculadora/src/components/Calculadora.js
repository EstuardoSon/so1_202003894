import React, { Component } from "react";
import Axios from "axios";
import TablaLogs from "./TablaLogs";

class Calculadora extends Component {
  constructor(props){
    super(props);
    this.state = {
      Operacion: "",
      operaciones:[]
    };

    this.mostrarLogs()
  }

  agregarDato = (e) => {
    this.setState({
      Operacion: this.state.Operacion + e.currentTarget.value,
    });
  };

  borrarDato = () => {
    this.setState({
      Operacion: this.state.Operacion.substring(
        0,
        this.state.Operacion.length - 1
      ),
    });
  };

  borrarOperacion = () => {
    this.setState({
      Operacion: "",
    });
  };

  calcular = (e) => {
    e.preventDefault();

    fetch("http://backend:8080/", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          Operacion: res.Resultado,
        });
        this.mostrarLogs()
      });
  };

  mostrarLogs = () => {
    Axios.get("http://backend:8080/")
      .then((response) => {
        this.setState({
          operaciones: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div className="m-4 d-flex justify-content-center  align-items-center">
          <form className="w-25" onSubmit={this.calcular}>
            <div className="row">
              <div className="col-md-1"></div>
              <input
                type="text"
                className="col-md-10"
                value={this.state.Operacion}
                readOnly
              />
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="7"
                onClick={this.agregarDato}
              >
                7
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="8"
                onClick={this.agregarDato}
              >
                8
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="9"
                onClick={this.agregarDato}
              >
                9
              </button>
              <button
                type="button"
                className="btn btn-danger col-md-2"
                onClick={this.borrarOperacion}
              >
                AC
              </button>
              <button
                type="button"
                className="btn btn-danger col-md-2"
                onClick={this.borrarDato}
              >
                DEL
              </button>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="4"
                onClick={this.agregarDato}
              >
                4
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="5"
                onClick={this.agregarDato}
              >
                5
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="6"
                onClick={this.agregarDato}
              >
                6
              </button>
              <button
                type="button"
                className="btn btn-primary col-md-2"
                value="*"
                onClick={this.agregarDato}
              >
                *
              </button>
              <button
                type="button"
                className="btn btn-primary col-md-2"
                value="/"
                onClick={this.agregarDato}
              >
                /
              </button>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="1"
                onClick={this.agregarDato}
              >
                1
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="2"
                onClick={this.agregarDato}
              >
                2
              </button>
              <button
                type="button"
                className="btn btn-light col-md-2"
                value="3"
                onClick={this.agregarDato}
              >
                3
              </button>
              <button
                type="button"
                className="btn btn-primary col-md-2"
                value="+"
                onClick={this.agregarDato}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-primary col-md-2"
                value="-"
                onClick={this.agregarDato}
              >
                -
              </button>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <button
                type="button"
                className="btn btn-light col-md-6"
                value="0"
                onClick={this.agregarDato}
              >
                0
              </button>
              <button type="submit" className="btn btn-success col-md-4">
                =
              </button>
              <div className="col-md-1"></div>
            </div>
          </form>
        </div>
        <TablaLogs Operaciones={this.state.operaciones}/>
      </div>
    );
  }
}

export default Calculadora;
