FROM node:14-alpine

ENV APP_DIR /app

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

COPY . $APP_DIR
RUN yarn install
RUN yarn build

RUN yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start" ]