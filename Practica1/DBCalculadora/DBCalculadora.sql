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