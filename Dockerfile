# Базовый образ — nginx на Alpine (лёгкий, ~25 МБ)
FROM nginx:alpine

# Рабочая директория внутри контейнера
WORKDIR /usr/share/nginx/html

# Удаляем стандартные файлы nginx
RUN rm -rf ./*

# Копируем файлы проекта в контейнер
COPY . .

# Открываем порт 80 (стандартный для nginx)
EXPOSE 80

# При старте контейнера запускаем nginx на переднем плане
CMD ["nginx", "-g", "daemon off;"]