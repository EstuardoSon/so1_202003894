# SCRIPT
Para el manejo de los reportes en consola fue necesaria la creacion de un script que consulta la informacion generada por el backend y que se almacenara en una funcion de volumes compartida entre la imagen de la consola y backend de docker.

```
#!/usr/bin/sh
patron=`wc -l < /app/Reporte.txt` #Lectura del numero de lineas del archivo Reporte.txt
echo "Logs realizados: $patron" > /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
patron=`cat /app/Reporte.txt | grep -c Error` #Contar el numero de errores
echo "Cant. Errores: $patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " + "` #Contar el numero de sumas
echo "Cant. Suma: $patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " - "` #Contar el numero de restas
echo "Cant. Resta: $patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " \* "` #Contar el numero de multiplicaciones
echo "Cant. Mult: $patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " / "` #Contar el numero de divisiones
echo "Cant. Div: $patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
fecha=`date +%F` #Obtener la fecha
patron=`cat /app/Reporte.txt | grep "$fecha"` #Leer el contenido de Reporte.txt y obtener las lineas que coincidan con el grep
echo "\nLogs de $fecha \n$patron" >> /tmp/consulta.log #Almacenar el resultado del echo en consulta.log
cat /tmp/consulta.log #Mostrar en pantalla el contenido de consulta.log
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
- La imagen utilizada para el contenedor es ubuntu:20.04
- Se agrega dentro del contenedor el script Script.sh en la ruta /root/Script.sh dentro del contenedor
- Se cambian los permisos del archivo dentro del contenedor a 0744
- Se ejecuta la instalacion de cron dentro del contenedor
- Se agrega un nuevo cron job al contenedor
- Se establece un punto de entrada del cron para visualizar su resultado
