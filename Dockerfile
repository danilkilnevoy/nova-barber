# Этап 1: Сборка Tailwind CSS
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только зависимости для кэширования
COPY package*.json ./
RUN npm ci

# Копируем остальные файлы
COPY . .

# Собираем Tailwind
RUN npm run build:css

# Этап 2: Продакшен-образ
FROM node:20-alpine

WORKDIR /app

# Устанавливаем только production-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранный проект
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/js ./js
COPY --from=builder /app/css ./css
COPY --from=builder /app/*.html ./
COPY --from=builder /app/robots.txt ./robots.txt
COPY --from=builder /app/sitemap.xml ./sitemap.xml
COPY --from=builder /app/docs ./docs


# Запуск от пользователя node (не root)
USER node

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]