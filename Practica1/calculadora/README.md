# Sobre la Aplicacion
La aplicacion fue desarrollada en nodejs para inicializar la aplicacion debe ejecutar el comando "npm install"

## Components
### App
Es el componente principal de la aplicacion en el cual se rederizara el componente Calculadora. Así contiene el codigo para la creacion de el header de la aplicacion.
### Calculadora
Conformado por el componente TablaLogs.js, este componente contiene el formulario con los botones y el input-type/text el cual contendra la operacion y el resultado de la operacion que se realizara.
El boton con el simbolo "=" contiene la accion de enviar los datos al backend por medio de un request http POST. 

~~~
calcular = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Operacion: this.state.Operacion }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          Operacion: res.Resultado,
        });
        this.mostrarLogs();
      });
  };
~~~