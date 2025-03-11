FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
RUN npm install -g nodemon
CMD ["node", "server.js"]
