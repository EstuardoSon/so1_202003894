# SCRIPT
Para el manejo de los reportes en consola fue necesaria la creacion de un script que consulta la informacion generada por el backend y que se almacenara en una funcion de volumes compartida entre la imagen de la consola y backend de docker.

```
#!/usr/bin/sh
patron=`wc -l < /app/Reporte.txt`
echo "Logs realizados: $patron" > /tmp/consulta.log
patron=`cat /app/Reporte.txt | grep -c Error`
echo "Cant. Errores: $patron" >> /tmp/consulta.log
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " + "`
echo "Cant. Suma: $patron" >> /tmp/consulta.log
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " - "`
echo "Cant. Resta: $patron" >> /tmp/consulta.log
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " \* "`
echo "Cant. Mult: $patron" >> /tmp/consulta.log
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " / "`
echo "Cant. Div: $patron" >> /tmp/consulta.log
fecha=`date +%F`
patron=`cat /app/Reporte.txt | grep "$fecha"`
echo "\nLogs de $fecha \n$patron" >> /tmp/consulta.log
cat /tmp/consulta.log
```

La primera linea de codigo nos indicara a la consola con que tipo de shell esta programado el script.
A continuacion se presentan una serie de comando de shell que permitiran mostrar los reportes deseados:
- Logs realizados
- Cantidad de sumas
- Cantidad de restas
- Cantidad de multiplicacion
- Cantidad de division
- Logs de la fecha en que se ejecuta el script

Los resultados de todos esos reportes son almacenados en un archivo que se almacenara en la direccion */tmp/consulta.log* y que a la finalizacion del script sera leido para mostrarlos en consola.

# Dockerfile
La imagen utilizada para la ejecucion del script en docker es ubuntu:20.04 el cual ejecutara cada minuto el script.

```
FROM ubuntu:20.04

ADD Script.sh /root/Script.sh

RUN chmod 0744 /root/Script.sh

RUN apt-get update && apt-get install cron -y -qq

RUN echo "* * * * * root /root/Script.sh > /proc/1/fd/1 2>/proc/1/fd/2" >> /etc/crontab

ENTRYPOINT [ "cron", "-f" ]
```

