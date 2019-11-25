FROM nginx:1.17.5-alpine

ENV APP_DIR=/var/www

WORKDIR $APP_DIR
COPY ./build $APP_DIR
COPY ./env-overwrite.sh $APP_DIR/env-overwrite.sh
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD sh env-overwrite.sh && nginx -g 'daemon off;'
