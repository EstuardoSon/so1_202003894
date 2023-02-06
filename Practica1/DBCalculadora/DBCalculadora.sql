create database if not exists DBCalculadora;
use DBCalculadora;

create table if not exists Operacion(
    Num1 int,
    Num2 int,
    Signo varchar(1),
    Fecha datetime
);

insert into Operacion values (12,13,'+','2020-01-01 15:10:10');
insert into Operacion values (12,13,'-','2020-01-01 15:10:10');

select * from Operacion;