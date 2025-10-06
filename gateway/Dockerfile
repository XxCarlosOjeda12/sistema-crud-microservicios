FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf

# puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]