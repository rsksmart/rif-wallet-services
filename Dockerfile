FROM node:25-slim

ARG arg_profile
ENV PROFILE="$arg_profile"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./.env.* ./

RUN npm run build

RUN chown -R node: /app
USER node

CMD ["npm", "run", "start:prod"]
