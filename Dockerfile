FROM node:20-alpine

WORKDIR /app

# Копируем только package.json и package-lock.json для кеширования зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая dev — нужны для сборки Tailwind)
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Собираем Tailwind CSS
RUN npm run build:css

# Указываем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Запускаем Node.js-сервер
CMD ["node", "server.js"]