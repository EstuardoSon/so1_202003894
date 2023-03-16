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

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo CPU Practica 2");
MODULE_AUTHOR("Estuardo Gabriel Son Mux");

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

    seq_printf(archivo,"{\n\"Procesos\":[\n");
    for_each_process(task){
      tiempo_tasks += task->stime;

      seq_printf(archivo,"{\"Pid\":%d,\"Nombre\":\"%s\",\"Usuario\":%d,",task->pid,task->comm,(task->cred)->uid.val);
      
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

      if(task->mm){
        pages = totalram_pages();
        ram = (get_mm_rss(task->mm)<<PAGE_SHIFT)/(1024*1024);
        totalRam = (pages << PAGE_SHIFT)/(1024*1024);
        seq_printf(archivo,", \"RamUsada\":%d, \"RamTotal\":%d, \"Threads\":[\n",ram,totalRam);
      }
      else{
        seq_printf(archivo,", \"RamUsada\":0, \"RamTotal\":%d, \"Threads\":[\n",totalRam);
      }

      for_each_thread(task, child) {
        seq_printf(archivo,"{\"Pid\":%d,\"Tpid\":%d,\"Nombre\":\"%s\"},\n",task->pid,child->pid,child->comm);
      }
      seq_printf(archivo,"]\n},\n");
    }
    seq_printf(archivo,"],\n");

    seq_printf(archivo,"\"CPUUsado\":%lld,\n\"CPUTotal\":%lld}\n",tiempo_tasks,jiffies_to_nsecs(jiffies_act));

    return 0;
}

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