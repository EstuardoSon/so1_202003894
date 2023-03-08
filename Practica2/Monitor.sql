DROP DATABASE Monitor;
Create database if not exists Monitor;
Use Monitor;

Create table if not exists Proceso(
    Pid int primary key,
    Nombre varchar(200),
    Usuario int,
    Estado varchar(50),
    Ram int
);

Create table if not exists Threads(
    Pid int,
    Tpid int primary key,
    Nombre varchar(200)
);

Create table if not exists Rendimiento(
    Cpu int,
    Ram int
);

insert into Rendimiento values(0,0);

alter table Threads add foreign key (Pid) references Proceso(Pid);

drop procedure if exists General;
create procedure General(out running int, out sleeping int, out stopped int, out zombie int, out total int, out cpu int, out ram int)
    begin
        select count(*) into running from Proceso where Estado='RUNNING';
        select count(*) into sleeping from Proceso where Estado='SLEEPING' ;
        select count(*) into stopped from Proceso where Estado='STOPPED' ;
        select count(*) into zombie from Proceso where Estado='ZOMBIE' ;
        select count(*) into total from Proceso;
        select * into cpu, ram from Rendimiento;
    end;

drop procedure if exists getThreads;
create procedure getThreads(in valor int)
    begin
        select * from Threads where Pid=valor;
    end;

drop procedure if exists getProcess;
create procedure getProcess()
    begin
        select * from Proceso;
    end;

drop procedure if exists setProcess;
create procedure setProcess(in Pid int, in Nombre varchar(200), in Usuario int, in Estado varchar(50), in Ram int)
    begin
        insert into Proceso values (Pid,Nombre,Usuario,Estado,Ram);
    end;

drop procedure if exists setThread;
create procedure setThread(in Pid int, in Tpid int, in Nombre varchar(200))
    begin
        insert into Threads values (Pid, Tpid, Nombre);
    end;

drop procedure if exists setRendimiento;
create procedure setRendimiento(in cpu int, in ram int)
    begin
        insert into Rendimiento values (cpu, ram);
    end;

drop procedure if exists clearData;
create procedure clearData()
    begin
        delete from Threads;
        delete from Proceso;
        delete from Rendimiento;
    end;