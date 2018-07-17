FROM node:carbon

# Create app directory
WORKDIR /var/vip/api

ADD . /var/vip/api

####### DEV
RUN npm install
RUN npm build
# CMD npm run dev

####### PRODUCTION
# RUN npm install
# RUN node_modules/.bin/tsc
# CMD node dist/app.init.js
