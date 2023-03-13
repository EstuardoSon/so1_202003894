Create database if not exists Monitor;
Use Monitor;

Create table if not exists Proceso(
    Pid int primary key,
    Nombre varchar(200),
    Usuario varchar(200),
    Estado varchar(50),
    Ram float
);

Create table if not exists Threads(
    Pid int,
    Tpid int primary key,
    Nombre varchar(200)
);

Create table if not exists Rendimiento(
    Cpu float,
    Ram int
);

insert into Rendimiento values(0,0);

alter table Threads add foreign key (Pid) references Proceso(Pid);

drop procedure if exists General;
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


drop procedure if exists getThreads;
DELIMITER &&
create procedure getThreads(in valor int)
    begin
        select * from Threads where Pid=valor;
    end&&
DELIMITER ;

drop procedure if exists getProcess;
DELIMITER &&
create procedure getProcess()
    begin
        select * from Proceso;
    end&&
DELIMITER ;

drop procedure if exists setProcess;
DELIMITER &&
create procedure setProcess(in Pid int, in Nombre varchar(200), in Usuario varchar(200), in Estado varchar(50), in Ram float)
    begin
        insert into Proceso values (Pid,Nombre,Usuario,Estado,Ram);
    end&&
DELIMITER ;

drop procedure if exists setThread;
DELIMITER &&
create procedure setThread(in Pid int, in Tpid int, in Nombre varchar(200))
    begin
        insert into Threads values (Pid, Tpid, Nombre);
    end&&
DELIMITER ;

drop procedure if exists setRendimiento;
DELIMITER &&
create procedure setRendimiento(in cpu float, in ram int)
    begin
        insert into Rendimiento values (cpu, ram);
    end&&
DELIMITER ;

drop procedure if exists clearData;
DELIMITER &&
create procedure clearData()
    begin
        delete from Threads;
        delete from Proceso;
        delete from Rendimiento;
    end&&
DELIMITER ;