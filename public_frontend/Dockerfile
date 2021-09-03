FROM node:alpine3.13

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . ./

# Nextjs had this issue where .next folder would be generated with root permissions
# RUN chown -Rh node:node .next

# USER node

CMD [  "npm","run", "dev" ]