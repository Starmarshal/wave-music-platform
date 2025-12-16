FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

RUN mkdir -p static/audio static/image

EXPOSE 5000

CMD ["node", "dist/main.js"]