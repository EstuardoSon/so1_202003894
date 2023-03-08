//Librerias para creacion del modulo
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>

//Librerias de para el funcionamiento del modulo
#include <linux/sched.h>
#include <linux/sched/signal.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo CPU Practica 2");
MODULE_AUTHOR("Estuardo Gabriel Son Mux");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    //Recorrer procesos y sus hijos
    struct task_struct *task =current;
    struct task_struct *child;
    //struct mm_struct *ram;

    //Calcular porcentaje de CPU utilizado
    unsigned int totalCPU = 0;
    unsigned int porcentajeCPU = 0;
    //unsigned long duracionJiffy = 1 / HZ;
    //unsigned long totalJiffies = jiffies * duracionJiffy;

    //Porcentaje de RAM usado por proceso
    //unsigned long totalRam, usadoRam;
    //int porcentajeRam;

    seq_printf(archivo,"{\n\"Procesos\":[\n");
    for_each_process(task){
      totalCPU += task->utime + task->stime;

      seq_printf(archivo,"{\"Pid\":%d,\"Nombre\":\"%s\",\"Usuario\":%d,",task->pid,task->comm,(task->cred)->uid.val);
      
      if(task->__state == TASK_RUNNING){
        seq_printf(archivo,"\"Estado\":\"RUNNING\", \"Ram\":0, ");
      }
      else if(task->__state == __TASK_STOPPED || task->__state == __TASK_TRACED || task->__state == TASK_WAKEKILL){
        seq_printf(archivo,"\"Estado\":\"STOPPED\", \"Ram\":0, ");
      }
      else if(task->exit_state == EXIT_ZOMBIE || task->__state == TASK_DEAD){
        seq_printf(archivo,"\"Estado\":\"ZOMBIE\", \"Ram\":0, ");
      }
      else if(task->__state == TASK_INTERRUPTIBLE || task->__state == TASK_UNINTERRUPTIBLE){
        seq_printf(archivo,"\"Estado\":\"SLEEPING\", \"Ram\":0, ");
      }
      else{
        seq_printf(archivo,"\"Estado\":\"OTRO\", \"Ram\":0, ");
      }

      seq_printf(archivo,"\"Threads\":[\n");

      for_each_thread(task, child) {
        seq_printf(archivo,"{\"Pid\":%d,\"Tpid\":%d,\"Nombre\":\"%s\"},\n",task->pid,child->pid,child->comm);
      }
      seq_printf(archivo,"]\n},\n");
    }
    seq_printf(archivo,"],\n");
    
    porcentajeCPU = totalCPU*1;

    seq_printf(archivo,"\"CPU\":%d\n}\n",porcentajeCPU);
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