#NODE
FROM node:18-alpine as api
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

EXPOSE 3001
COPY . ./
CMD [ "node", "src/index.js" ]
