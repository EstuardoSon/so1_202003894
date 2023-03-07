import React, { Component } from "react";

class TablaProcesos extends Component {
  state = {
    pid: 0,
  };

  handleProcessClick = (pid) => {
    if(this.state.pid == pid){
      this.setState({
        pid :-1 
      });
    }
    else{
      this.setState({
        pid 
      });
    }
  };

  render() {
    return (
      <ul className="nav nav-pills flex-column">
        {this.props.data.length
          ? this.props.data.map((proceso) => (
              <li key={proceso.pid} className="nav-item dropdown">
                <p
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.handleProcessClick(proceso.pid)}
                >
                  PID: {proceso.pid} Nombre: {proceso.nombre} Usuario:{" "}
                  {proceso.usuario} Estado: {proceso.estado} %RAM:{proceso.ram}
                </p>
                {this.state.pid === proceso.pid && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "0px",
                      left: "25%",
                      margin: "0px",
                      transform: "translate(0px, 42px)",
                    }}
                    data-popper-placement="bottom-start"
                  >
                    {
                      proceso.threads
                      ? proceso.threads.map((thread) => (
                        <p className="dropdown-item">PID: {thread.tpid}  Nombre: {thread.nombre}</p>
                      )):null
                    }
                  </div>
                )}
              </li>
            ))
          : null}
      </ul>
    );
  }
}

export default TablaProcesos;
