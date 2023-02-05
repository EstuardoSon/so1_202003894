import "./App.css";
import Calculadora from "./components/Calculadora";


function App() {
  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <h3>
            Calculadora
            <small class="text-muted"> Estuardo Gabriel Son Mux</small>
          </h3>
        </div>
      </nav>
      <Calculadora />
    </div>
  );
}

export default App;
