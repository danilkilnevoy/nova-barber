# SEO-аудит NOVA BARBER

## Замер «до»
Скриншот: `before.png`
Оценка SEO: 83/100

### Проблемы до:
- Отсутствовал `meta description` на страницах.
- Файл `robots.txt` не существовал — сервер отдавал HTML главной страницы вместо него.
- Не было `sitemap.xml`.

## Что исправлено
- Добавлены уникальные `title` и `description` на все публичные страницы.
- Добавлен `lang="ru"` на `<html>`.
- Проверена структура заголовков (один `<h1>` на страницу, без пропусков уровней).
- Создан `robots.txt` с закрытием приватных разделов (`/account.html`, `/login.html`, `/api/`) и строкой `Sitemap:`.
- Создан `sitemap.xml` со всеми публичными страницами (абсолютные адреса).
- На `account.html` и `login.html` добавлен `<meta name="robots" content="noindex">`.
- API закрыт от индексации заголовком `X-Robots-Tag: noindex, nofollow` в `server.js`.

## Замер «после»
Скриншот: `after.png`
Оценка SEO: 100/100

## Что не исправлено
- В `sitemap.xml` используется адрес-заглушка `https://example.com` — будет заменён на реальный домен при публикации.

## Проверка
- `http://localhost:3000/robots.txt` — открывается корректно.
- `http://localhost:3000/sitemap.xml` — открывается корректно (XML).
- `http://localhost:3000/api/health` — в ответе есть заголовок `X-Robots-Tag`.