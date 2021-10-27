FROM node:12

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./.env ./

RUN npm run build

RUN chown -R node: /app
USER node

CMD ["npm", "run", "start:prod"]
