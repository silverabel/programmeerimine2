FROM node:14.16.0-alpine
WORKDIR /programmeerimine2
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]