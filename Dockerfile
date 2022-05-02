FROM node:14.15.0
WORKDIR /home/node/app
COPY package.json yarn.lock ./
COPY ./tsconfig.json .
COPY ./types.d.ts .
COPY ./config ./config
# COPY ./.eslintrc.js ./
# COPY ./.eslintignore ./
COPY ./src ./src
RUN yarn
# RUN yarn build
# CMD yarn start
CMD yarn dev
EXPOSE 3000