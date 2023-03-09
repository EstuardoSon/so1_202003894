import React, { Component } from "react";

class TablaProcesos extends Component {
  state = {
    pid: 0,
  };

  handleProcessClick = (pid) => {
    if (this.state.pid == pid) {
      this.setState({
        pid: -1,
      });
    } else {
      this.setState({
        pid,
      });
    }
  };

  render() {
    return (
      <ul className="nav nav-pills flex-column">
        {this.props.data.length
          ? this.props.data.map((proceso) => (
              <li key={proceso.Pid} className="nav-item dropdown">
                <p
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.handleProcessClick(proceso.Pid)}
                >
                  PID: {proceso.Pid} Nombre: {proceso.Nombre} Usuario:{" "}
                  {proceso.Usuario} Estado: {proceso.Estado} %RAM:{proceso.Ram}
                </p>
                {this.state.pid === proceso.Pid && (
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
                    {proceso.Threads
                      ? proceso.Threads.map((thread) => (
                          <p className="dropdown-item">
                            PID: {thread.Tpid} Nombre: {thread.Nombre}
                          </p>
                        ))
                      : null}
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
