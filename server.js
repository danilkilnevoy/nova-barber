const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Отдаём статику из корня проекта (HTML, CSS, JS, фото)
app.use(express.static(path.join(__dirname)));

// API-роут для проверки работоспособности
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'NOVA BARBER API'
  });
});

// SPA-режим: все остальные запросы → index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});