# Monitor.sql
En este archivo contiene la informacion para la creacion de la base de datos.

```
// Crear la base de datos si no existe
Create database if not exists Monitor;

// Usar la base de datos creada
Use Monitor;

// Crear la tabla Proceso
Create table if not exists Proceso(
    Pid int primary key,
    Nombre varchar(200),
    Usuario varchar(200),
    Estado varchar(50),
    Ram float
);

// Crear la tabla Threads
Create table if not exists Threads(
    Pid int,
    Tpid int primary key,
    Nombre varchar(200)
);

// Crear la tabla Rendimiento
Create table if not exists Rendimiento(
    Cpu float,
    Ram int
);

// Insertar dato en la tabla Rendimiento
insert into Rendimiento values(0,0);

// Crear una llave foranea
alter table Threads add foreign key (Pid) references Proceso(Pid);

// Eliminar el procedimiento General
drop procedure if exists General;

// Crear el procedimiento General
DELIMITER &&
create procedure General(out running int, out sleeping int, out stopped int, out zombie int, out total int, out cpu int, out ram int)
    begin
        select count(*) into running from Proceso where Estado='RUNNING';
        select count(*) into sleeping from Proceso where Estado='SLEEPING' ;
        select count(*) into stopped from Proceso where Estado='STOPPED' ;
        select count(*) into zombie from Proceso where Estado='ZOMBIE' ;
        select count(*) into total from Proceso;
        select * into cpu, ram from Rendimiento;
    end &&
DELIMITER ;

// Eliminar el procedimiento getThreads
drop procedure if exists getThreads;

// Crear el procedimiento getThreads
DELIMITER &&
create procedure getThreads(in valor int)
    begin
        select * from Threads where Pid=valor;
    end&&
DELIMITER ;

// Eliminar el procedimiento getProcess
drop procedure if exists getProcess;

// Crear el procedimiento getProcess
DELIMITER &&
create procedure getProcess()
    begin
        select * from Proceso;
    end&&
DELIMITER ;

// Eliminar el procedimiento 
drop procedure if exists setProcess;

// Crear el procedimiento setProcess
DELIMITER &&
create procedure setProcess(in Pid int, in Nombre varchar(200), in Usuario varchar(200), in Estado varchar(50), in Ram float)
    begin
        insert into Proceso values (Pid,Nombre,Usuario,Estado,Ram);
    end&&
DELIMITER ;

// Eliminar el procedimiento setThread
drop procedure if exists setThread;

// Eliminar el procedimiento setThread
DELIMITER &&
create procedure setThread(in Pid int, in Tpid int, in Nombre varchar(200))
    begin
        insert into Threads values (Pid, Tpid, Nombre);
    end&&
DELIMITER ;

// Eliminar el procedimiento setRendimiento
drop procedure if exists setRendimiento;

// Crear el procedimiento setRendimiento
DELIMITER &&
create procedure setRendimiento(in cpu float, in ram int)
    begin
        insert into Rendimiento values (cpu, ram);
    end&&
DELIMITER ;

// Eliminar el procedimiento clearData
drop procedure if exists clearData;

// Crear el procedimiento clearData
DELIMITER &&
create procedure clearData()
    begin
        delete from Threads;
        delete from Proceso;
        delete from Rendimiento;
    end&&
DELIMITER ;
```