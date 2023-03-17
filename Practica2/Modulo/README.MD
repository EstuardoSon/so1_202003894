# Modulo CPU
Este modulo obtine la informacion de los procesos que se estan ejecutando, sus hijos, y la cantidad total de procesos en cada uno de sus estados.

## Importe de librerias
```
//Librerias para creacion del modulo
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/types.h>

//Librerias de para el funcionamiento del modulo
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/mm.h>
```

## Escribir dentro del Modulo 
```
static int escribir_archivo(struct seq_file *archivo, void *v)
{
    //Recorrer procesos y sus hijos
    struct task_struct *task =current;
    struct task_struct *child;

    //Calcular porcentaje de CPU utilizado
    unsigned long long tiempo_tasks = 0;
    unsigned long long jiffies_act = jiffies;

    //Porcentaje de RAM usado por proceso
    unsigned int ram = 0;
    int totalRam = 0;
    unsigned long pages;

    // Inicio de creacion del json
    seq_printf(archivo,"{\n\"Procesos\":[\n");
    
    // Inicio de recorrido de procesos
    for_each_process(task){
      // Obtener el tiempo que se ha ejecutado el proceso en modo usuario
      tiempo_tasks += task->stime;

      // Obtener informacion del proceso
      seq_printf(archivo,"{\"Pid\":%d,\"Nombre\":\"%s\",\"Usuario\":%d,",task->pid,task->comm,(task->cred)->uid.val);
      
      //Obtener el estado en el que se encuentra el proceso 
      if(task->__state == TASK_RUNNING){
        seq_printf(archivo,"\"Estado\":\"RUNNING\"");
      }
      else if(task->__state == __TASK_STOPPED || task->__state == __TASK_TRACED || task->__state == TASK_WAKEKILL){
        seq_printf(archivo,"\"Estado\":\"STOPPED\"");
      }
      else if(task->exit_state == EXIT_ZOMBIE || task->__state == TASK_DEAD){
        seq_printf(archivo,"\"Estado\":\"ZOMBIE\"");
      }
      else if(task->__state == TASK_INTERRUPTIBLE || task->__state == TASK_UNINTERRUPTIBLE){
        seq_printf(archivo,"\"Estado\":\"SLEEPING\"");
      }
      else{
        seq_printf(archivo,"\"Estado\":\"OTRO\"");
      }

      // Obtener porcentaje usado de RAM por proceso
      if(task->mm){
        pages = totalram_pages();
        ram = (get_mm_rss(task->mm)<<PAGE_SHIFT)/(1024*1024);
        totalRam = (pages << PAGE_SHIFT)/(1024*1024);
        seq_printf(archivo,", \"RamUsada\":%d, \"RamTotal\":%d, \"Threads\":[\n",ram,totalRam);
      }
      else{
        seq_printf(archivo,", \"RamUsada\":0, \"RamTotal\":%d, \"Threads\":[\n",totalRam);
      }

      // Recorrer procesos hijos
      for_each_thread(task, child) {
        seq_printf(archivo,"{\"Pid\":%d,\"Tpid\":%d,\"Nombre\":\"%s\"},\n",task->pid,child->pid,child->comm);
      }
      seq_printf(archivo,"]\n},\n");
    }
    seq_printf(archivo,"],\n");

    // Retornar total de tiempo usado por tareas y tiempo total del CPU
    seq_printf(archivo,"\"CPUUsado\":%lld,\n\"CPUTotal\":%lld}\n",tiempo_tasks,jiffies_to_nsecs(jiffies_act));

    return 0;
}
```

## Funciones al Instalar y al Eliminacion

```
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("cpu_202003894", 0, NULL, &operaciones);
    printk(KERN_INFO "Estuardo Gabriel Son Mux\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_202003894", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);
```

# Modulo RAM
Este modulo devuelve la informacion del porcentaje total de RAM utilizado.

## Importe de librerias
```
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>
#include <linux/swap.h>
```

## Escribir dentro del modulo
```
static int escribir_archivo(struct seq_file *archivo, void *v)
{
    // Obtener informacion de la libreria sysinfo
    struct sysinfo info;
    long totalRAM = 0;
    long ramLibre = 0;
    long ramUsada = 0;
    int porcentaje = 0;

    si_meminfo(&info);

    // Calcular el porcentaje de ram usado
    totalRAM = info.totalram;
    ramLibre = info.freeram;
    ramUsada = totalRAM - ramLibre;

    porcentaje = (ramUsada*100) / totalRAM;
    seq_printf(archivo,"{\"Ram\":%d}", porcentaje);
    return 0;
}
```

## Funciones al Instalar y al Eliminacion
```
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("ram_202003894", 0, NULL, &operaciones);
    printk(KERN_INFO "202003894\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("Sistemas Operativos 1", NULL);
    printk(KERN_INFO "RAM Primer Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);
```