#!/usr/bin/env bash
patron=`wc -l < /app/Reporte.txt`
echo "Logs realizados: $patron"
patron=`cat /app/Reporte.txt | grep -c Error`
echo "Cant. Errores: $patron"
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " + "`
echo "Cant. Suma: $patron"
patron=`cat /app/Reporte.txt | grep -v Error | grep -c " - "`
echo "Cant. Resta: $patron"
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " \* "`
echo "Cant. Mult: $patron"
patron=`cat /app/Reporte.txt| grep -v Error | grep -c " / "`
echo "Cant. Div: $patron"
fecha=`date +%F`
patron=`cat /app/Reporte.txt | grep "$fecha"`
echo "\nLogs de $fecha \n$patron"
