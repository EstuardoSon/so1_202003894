import "./App.css";
import Calculadora from "./components/Calculadora";
import TablaLogs from "./components/TablaLogs";


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
      <TablaLogs />
    </div>
  );
}

export default App;
