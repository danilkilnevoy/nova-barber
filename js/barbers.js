(() => {
  const images = {
    'илья козлов': 'images/barber-ilya.jpg',
    'роман волков': 'images/barber-roman.jpg',
    'алексей петров': 'images/barber-alexey.jpg',
    'максим смирнов': 'images/barber-maxim.jpg'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);

  async function loadBarbers(targetId, limit = Infinity) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!window.novaDb) {
      target.innerHTML = '<p class="empty">Нет подключения к базе данных.</p>';
      return;
    }

    try {
      const { data, error } = await window.novaDb
        .from('barbers')
        .select('id,first_name,last_name,qualification,rating,branch_id,portfolio_url')
        .order('id');

      if (error) throw error;

      if (!data?.length) {
        target.innerHTML = '<p class="empty">Барберы пока не добавлены.</p>';
        return;
      }

      target.innerHTML = data.slice(0, limit).map(barber => {
        const name = [barber.first_name, barber.last_name]
          .filter(Boolean).join(' ');
        const key = name.trim().toLocaleLowerCase('ru-RU');
        const photo = images[key] || barber.portfolio_url || '';
        const rating = Number(barber.rating || 0).toFixed(1);

        // Обновленная структура карточки
        return `
          <article class="barber-card">
            <div class="barber-photo">
              ${photo
                ? `<img src="${esc(photo)}" alt="${esc(name)}" loading="lazy">`
                : '<div class="empty">Добавь фото мастера</div>'}
            </div>
            <div class="barber-content">
              <div class="barber-header">
                <span class="barber-name">${esc(name)}</span>
                <span class="barber-rating">${rating}</span>
              </div>
              <span class="barber-specialty">${esc(barber.qualification || 'Барбер')}</span>
              <a class="pill-button" href="booking.html?barber=${encodeURIComponent(barber.id)}">
                Записаться
              </a>
            </div>
          </article>
        `;
      }).join('');
    } catch (error) {
      console.error('Ошибка загрузки барберов:', error);
      target.innerHTML = '<p class="empty">Не удалось загрузить команду. Проверь настройки Supabase и права SELECT.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadBarbers('barberGrid');
    loadBarbers('homeBarbers', 4);
  });
})();