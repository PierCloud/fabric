# syntax=docker/dockerfile:1

FROM node:14

WORKDIR /usr/src/app
COPY package.json ./

RUN npm i && npm audit fix

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start"]
