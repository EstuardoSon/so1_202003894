# Base de Datos
La base de datos es **DBCalculadora** utilizada consta unicamente de una sola table de nombre **Operacion** la cual posee 5 atributos, los cuales son:
- Num1: tipo entero
- Num2: tipo entero
- Signo: tipo varchar de longitud maxima de 1 caracter
- Resultado: tipo varchar de longitud maxima de 1000 caracteres
- Fecha: tipo date time

```
create database if not exists DBCalculadora;
use DBCalculadora;

create table if not exists Operacion(
    Num1 int,
    Num2 int,
    Signo varchar(1),
    Resultado varchar(1000),
    Fecha datetime
);

select * from Operacion;
```

---
# Dockerfile
El Dockerfile contiene la infomracion para la creacion de la imagen que se utilizara para la base de datos
```
FROM mysql:8.0.32 as database

COPY ./DBCalculadora.sql /docker-entrypoint-initdb.d

EXPOSE 3306
```
- La imagen utilizada es mysql:8.0.32
- Se copia el codigo DBCalculadora.sql dentro de la ruta /docker-entrypoint-intdb.d en el contenedor.
- Se expone el puerto 3306