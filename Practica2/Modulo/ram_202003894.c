#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>
#include <linux/swap.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo RAM Practica 2");
MODULE_AUTHOR("Estuardo Gabriel Son Mux");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct sysinfo info;
    long totalRAM = 0;
    long ramLibre = 0;
    long ramUsada = 0;
    int porcentaje = 0;

    si_meminfo(&info);
    totalRAM = info.totalram;
    ramLibre = info.freeram;
    ramUsada = totalRAM - ramLibre;

    porcentaje = (ramUsada*100) / totalRAM;
    seq_printf(archivo,"{\"ram\":%d}", porcentaje);
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
    proc_create("ram_202003894", 0, NULL, &operaciones);
    printk(KERN_INFO "RAM Estuardo Gabriel Son Mux\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202003894", NULL);
    printk(KERN_INFO "RAM Primer Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);