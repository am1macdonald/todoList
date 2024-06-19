FROM node:22-alpine

WORKDIR usr/src/app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "preview" ]

EXPOSE 5173

