FROM mysql:8.0.32 as database

COPY ./Monitor.sql /docker-entrypoint-initdb.d

EXPOSE 3306