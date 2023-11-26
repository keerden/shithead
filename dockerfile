FROM node:20.9-alpine3.17

WORKDIR /usr/local/shithead

COPY package.json package-lock.json ./
RUN set -ex \
&& apk update \
&& apk upgrade \
&& apk add tzdata \
&& npm install \ 
&& npm ci --only=production

ENV TZ Europe/Amsterdam
COPY . .

EXPOSE 8080
EXPOSE 3000
CMD [ "npm", "start" ]