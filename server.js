const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Доверяем заголовкам от nginx (X-Forwarded-For, X-Forwarded-Proto, X-Forwarded-Host)
// 1 — это количество прокси-серверов перед приложением
app.set('trust proxy', 1);

// Middleware для обработки JSON (если понадобится для API)
app.use(express.json());

// API-роут для проверки работоспособности
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'NOVA BARBER API',
    protocol: req.protocol, // покажет 'https', если nginx правильно передал заголовок
    host: req.get('host')
  });
});

// Статика (HTML, CSS, JS) — nginx будет её отдавать, но сервер тоже должен уметь
app.use(express.static(path.join(__dirname)));

// SPA-режим: все остальные GET-запросы → index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});