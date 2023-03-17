# Practica 2 - 202003894

El proposito de la practica es la utilizacion de google Cloud para el lanzamiento de una aplicacion que muestre el rendimiento de una computadora, en este caso instacias de VM del mismo google Cloud, asi mismo las mismas estan conectadas a una base de datos tambien ejecutada en google cloud.

| Servicio | Manual |
| ------ | ------ |
| Frontend | [frontend/README.md](https://github.com/EstuardoSon/so1_202003894/blob/main/Practica2/frontend/README.md) |
| Backend GO | [Go/README.md](https://github.com/EstuardoSon/so1_202003894/blob/main/Practica2/Go/README.MD) |
| API | [Api/README.md](https://github.com/EstuardoSon/so1_202003894/blob/main/Practica2/Api/README.MD) |
| Modulos | [Modulo/README.md](https://github.com/EstuardoSon/so1_202003894/blob/main/Practica2/Modulo/README.MD) |
| DB | [Database/README.md](https://github.com/EstuardoSon/so1_202003894/blob/main/Practica2/Database/README.MD) |

---
# VM Modulo
Para la creacion la correcta ejecucion de esta maquina virutal primero debe instalar los modulos con los comandos:

```
sudo insmod cpu_202003894.ko
sudo insmod ram_202003894.ko
```

En caso quiera eliminarlos pude usar los comandos:
```
sudo rmmod cpu_202003894.ko
sudo rmmod ram_202003894.ko
```

Una vez instalado los modulos Ram debe asegurarse que la base de datos ya este en funcionamiento para iniciar el contenedor de go de docker.

```
// Descargar la imagen de GO
sudo docker pull estuardosonu/backend_practica2_202003894

// Crear componente monitorgo
sudo docker create --name monitorgo -p8080:8080 -e HOST='TU_HOST' -e USER_NAME='USER_NAME' -e PASSWORD='USER_PASSWORD' -e DATABASE='DB_NAME' --read-only  -v /etc/passwd:/etc/passwd  estuardosonu/backend_practica2_202003894

// Iniciar el componente
sudo docker start monitorgo

// Detener el componente
sudo docker stop monitorgo
```

# VM Frontend
Para la correcta instalacion de esta maquina virtual debe asegurarse que la base de datos ya este en funcionamiento. Una vez comprobado esto se puede proceder a la instalacion de los contenedores de docker.

```
// Descargar las imagenes de Nodejs y Nginx
sudo docker pull estuardosonu/api_practica2_202003894
sudo docker pull estuardosonu/frontend_practica2_202003894

//Crear la network practica2
docker network create -d bridge practica2

// Crear y ejecutar primero el componente monitorapi
// Crear componente monitorapi
sudo docker create --network practica2 --name monitorapi --expose 3001  -p3001:3001 -e HOST='TU_HOST' -e USER_NAME='USER_NAME' -e PASSWORD='USER_PASSWORD' -e DATABASE='DB_NAME' estuardosonu/api_practica2_202003894

// Iniciar el componente monitorapi
sudo docker start monitorapi

// Crear componente monitorreact
sudo docker create --name monitorreact -p3000:80 --network practica2 --expose 80 estuardosonu/frontend_practica2_202003894

// Iniciar el componente monitorreact
sudo docker start monitorreact

// En caso de detener los componentes
sudo docker stop monitorapi
sudo docker stop monitorreact

```