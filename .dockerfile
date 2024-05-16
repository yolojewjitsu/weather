FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./
RUN npm install

# Копируем исходный код и запускаем сервер
COPY . ./

EXPOSE 3000
CMD ["node", "index.js"]
