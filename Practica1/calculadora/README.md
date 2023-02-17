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

    fetch("http://0.0.0.0:8080/", {
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
    Axios.get("http://0.0.0.0:8080/")
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

El resultado se de la solicitud se almacena en el state operaciones para posteriormente mostrarse en el componente TablaLogs.

## TablaLogs
En este componente se crea una tabla que incrementara su numero de filas y columnas correpondientemente con el numero de operaciones retornadas por la solicitud GET anteriormente mencionada.

---
# Docker
Para la creacion de la imagen de docker que contendra el codigo para la ejecucion de la aplicacion se tiene un archivo **Dockerfile**

~~~
FROM node:18-alpine as frontend

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

FROM nginx:1.22.1 as runner
COPY --from=frontend /app/build /usr/share/nginx/html

EXPOSE 80
~~~

- La imagen utilizada para este contenedor es de node:18-alpine
- Se establece la direccion en la que se trabajara con WORKDIR
- Se establece el entorno y la direccion donde se instalaran los modulos con ENV
- Se copia el contenido de package.json
- Se copia el contenido de package-lock.json
- Se ejecuta npm install dentro del contenedor
- Se ejecuta npm install react-scripts dentro del contenedor
- Se copian los archivos que conforman el frontend en la ruta /app dentro del contenedor 
- Se procede a la compilacion del proyecto react
- Se crea una imagen con nginx
- Se copia la ruta en donde se creo la compilacion del proyecto de react dentro de la carpeta /usr/share/nginx/html de la nueva imagen
- Se expone el puerto 80