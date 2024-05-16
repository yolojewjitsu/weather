# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./
RUN npm install

# Копируем исходный код и собираем проект
COPY . ./
RUN npm run build

# Stage 2: Serve the app using a simple static file server
FROM node:18-alpine

WORKDIR /app

# Устанавливаем HTTP сервер для сервинга файлов
RUN npm install -g serve

# Копируем собранный фронтенд из стадии сборки
COPY --from=build /app/dist ./dist

# Указываем команду по умолчанию для запуска приложения
CMD ["serve", "-s", "dist"]
