import React, { Component } from "react";

class Calculadora extends Component {
  agregarDato = (e) => {
    this.setState({
        operacion : this.state.operacion + e.currentTarget.value
    })
  };

  borrarDato = () => {
    this.setState({
        operacion : this.state.operacion.substring(0,this.state.operacion.length -1)
    })
  };

  borrarOperacion = () => {
    this.setState({
        operacion : ""
    })
  };

  calcular = (e) => {
    e.preventDefault();
  }

  state = {
    operacion: "",
  };
  render() {
    return (
      <div className="m-4 d-flex justify-content-center  align-items-center">
        <form className="w-25" onSubmit={this.calcular}>
        <div className="row">
            <div className="col-md-1"></div>
            <input type="text" className="col-md-10" value={this.state.operacion} readOnly/>
            <div className="col-md-1"></div>
          </div>
          <div className="row">
            <div className="col-md-1"></div>
            <button type="button" class="btn btn-light col-md-2" value="7" onClick={this.agregarDato}>
              7
            </button>
            <button type="button" class="btn btn-light col-md-2" value="8" onClick={this.agregarDato}>
              8
            </button>
            <button type="button" class="btn btn-light col-md-2" value="9" onClick={this.agregarDato}>
              9
            </button>
            <button type="button" class="btn btn-danger col-md-2" onClick={this.borrarOperacion}>
              AC
            </button>
            <button type="button" class="btn btn-danger col-md-2" onClick={this.borrarDato}>
              DEL
            </button>
            <div className="col-md-1"></div>
          </div>
          <div className="row">
            <div className="col-md-1"></div>
            <button type="button" class="btn btn-light col-md-2" value="4" onClick={this.agregarDato}>
              4
            </button>
            <button type="button" class="btn btn-light col-md-2" value="5" onClick={this.agregarDato}>
              5
            </button>
            <button type="button" class="btn btn-light col-md-2" value="6" onClick={this.agregarDato}>
              6
            </button>
            <button type="button" class="btn btn-primary col-md-2" value="*" onClick={this.agregarDato}>
              *
            </button>
            <button type="button" class="btn btn-primary col-md-2" value="/" onClick={this.agregarDato}>
              /
            </button>
            <div className="col-md-1"></div>
          </div>
          <div className="row">
            <div className="col-md-1"></div>
            <button type="button" class="btn btn-light col-md-2" value="1" onClick={this.agregarDato}>
              1
            </button>
            <button type="button" class="btn btn-light col-md-2" value="2" onClick={this.agregarDato}>
              2
            </button>
            <button type="button" class="btn btn-light col-md-2" value="3" onClick={this.agregarDato}>
              3
            </button>
            <button type="button" class="btn btn-primary col-md-2" value="+" onClick={this.agregarDato}>
              +
            </button>
            <button type="button" class="btn btn-primary col-md-2" value="-" onClick={this.agregarDato}>
              -
            </button>
            <div className="col-md-1"></div>
          </div>
          <div className="row">
            <div className="col-md-1"></div>
            <button type="button" class="btn btn-light col-md-6" value="0" onClick={this.agregarDato}>
              0
            </button>
            <button type="submit" class="btn btn-success col-md-4">
              =
            </button>
            <div className="col-md-1"></div>
          </div>
        </form>
      </div>
    );
  }
}

export default Calculadora;
