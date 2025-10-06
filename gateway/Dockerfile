FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

COPY nginx.render.conf /etc/nginx/nginx.conf

#80 Local
EXPOSE 10000  

CMD ["nginx", "-g", "daemon off;"]