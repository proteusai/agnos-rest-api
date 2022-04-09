FROM node:14.15.0
WORKDIR /home/node/app
COPY package.json yarn.lock ./
COPY ./tsconfig.json .
COPY ./config ./config
# COPY ./.eslintrc.js ./
# COPY ./.eslintignore ./
COPY ./src ./src
# RUN npm ci --only=production
RUN yarn
RUN yarn build
CMD yarn start
EXPOSE 3000