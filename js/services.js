/* js/services.js — Логика страницы услуг */

(() => {
  // Карта картинок для услуг (сопоставление по названию)
  const images = {
    'мужская стрижка': 'images/service-muzhskaya.jpg',
    'стрижка бороды и усов': 'images/service-boroda.jpg',
    'комплекс: стрижка + борода': 'images/service-kompleks.jpg',
    'детская стрижка': 'images/service-detskaya.jpg',
    'отец + сын': 'images/service-otec-syn.jpg',
    'камуфляж седины': 'images/service-kamuflyazh.jpg',
    'уход за лицом': 'images/service-uhod.jpg'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);

  async function loadServices(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!window.novaDb) {
      target.innerHTML = '<p class="empty">Нет подключения к базе данных.</p>';
      return;
    }

    try {
      const { data, error } = await window.novaDb
        .from('services')
        .select('id, title, price, duration_minutes')
        .order('id');

      if (error) throw error;

      if (!data?.length) {
        target.innerHTML = '<p class="empty">Услуги пока не добавлены.</p>';
        return;
      }

      target.innerHTML = data.map(service => {
        // Ищем картинку по названию (без учета регистра)
        const key = (service.title || '').toLowerCase().trim();
        const photo = images[key] || 'images/service-placeholder.jpg';

        return `
          <article class="service-card">
            <img class="service-bg" src="${esc(photo)}" alt="${esc(service.title)}" loading="lazy">
            <div class="service-content">
              <h3 class="service-title">${esc(service.title)}</h3>
              <p class="service-meta">${service.duration_minutes} мин</p>
              <p class="service-price">${Number(service.price).toFixed(0)} ₽</p>
              <a class="pill-button" href="booking.html?service=${service.id}">
                Выбрать
              </a>
            </div>
          </article>
        `;
      }).join('');

    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      target.innerHTML = '<p class="empty">Не удалось загрузить услуги.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadServices('serviceGrid');
  });
})();