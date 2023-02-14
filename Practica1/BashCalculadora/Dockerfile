FROM ubuntu:20.04

ADD Script.sh /root/Script.sh

RUN chmod 0744 /root/Script.sh

RUN apt-get update && apt-get install cron -y -qq

RUN echo "* * * * * root /root/Script.sh > /proc/1/fd/1 2>/proc/1/fd/2" >> /etc/crontab

ENTRYPOINT [ "cron", "-f" ]
