FROM node:16-alpine3.11

WORKDIR /usr/app

COPY package.json *.js entrypoint.sh  ./
RUN ls -la
RUN npm install

CMD ["sh", "entrypoint.sh"]