import "./App.css";
import Calculadora from "./components/Calculadora";


function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <h3>
            Calculadora
            <small className="text-muted"> Estuardo Gabriel Son Mux</small>
          </h3>
        </div>
      </nav>
      <Calculadora />
    </div>
  );
}

export default App;
