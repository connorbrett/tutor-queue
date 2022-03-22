FROM nginx:latest

RUN rm /var/log/nginx/*
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
