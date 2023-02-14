# REACT
La aplicacion fue desarrollada en nodejs para inicializar la aplicacion debe ejecutar el comando "npm install"

## Components
### App
Es el componente principal de la aplicacion en el cual se rederizara el componente Calculadora. Así contiene el codigo para la creacion de el header de la aplicacion.

### Calculadora
Conformado por el componente TablaLogs.js, este componente contiene el formulario con los botones y el input/text el cual contendra la operacion y el resultado de la operacion que se realizara.
El boton con el simbolo "=" contiene la accion de enviar los datos al backend por medio de un request http POST dentro de una funcion llamada **calcular**. 

```
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
```
Esta solicitud POST retorna un texto json con que contiene el resultado de la operacion que se mostrara posteriormente en el input/text.

Si se es atento se podra notar que la funcion calcular contiene la ejecucion de la funcion **mostrarlogs**. Esta funcion es la encargada de realizar el request http GET para obtener los datos almacenados de ejecuciones anteriores.

```
mostrarLogs = () => {
    Axios.get("http://localhost:8080/")
      .then((response) => {
        this.setState({
          operaciones: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    };
```

## Calculadora
En este componente se crea una tabla que incrementara su numero de filas y columnas correpondientemente con el numero de operaciones retornadas por la solicitud GET anteriormente mencionada.

---
# Docker
Para la creacion de la imagen de docker que contendra el codigo para la ejecucion de la aplicacion se tiene un archivo **Dockerfile**

~~~
FROM node:18-alpine as frontend

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
~~~