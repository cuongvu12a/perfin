# Install dependencies only when needed
FROM node:14.18.3-alpine 

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

ENV timezone="Asia/Ho_Chi_Minh"

RUN ln -snf /usr/share/zoneinfo/$timezone /etc/localtime && echo $timezone > /etc/timezone
RUN set -eux \
    && apk add --no-cache --virtual .build-deps\
        nginx \
        supervisor

ADD ./ci-cd/staging/nginx-site.conf /etc/nginx/http.d/default.conf
ADD ./ci-cd/staging/supervisord.conf /etc/supervisord.conf

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./ci-cd/staging/variables .env
COPY . .
RUN yarn build

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
