FROM node:lts-alpine

COPY src /app/src
COPY test /app/test
COPY jest.config.js package.json tsconfig.json yarn.lock /app/

WORKDIR /app

ENV DEBUG="*"

RUN yarn install

ENTRYPOINT ["yarn", "test"]