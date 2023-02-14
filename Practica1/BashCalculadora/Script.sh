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
