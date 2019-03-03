FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./build /app
COPY ./build/public /app/public
CMD node /app/server.js
EXPOSE 3000:3000