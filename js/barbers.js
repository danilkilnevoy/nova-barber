(() => {
  const images = {
    'илья козлов': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/barber-ilya.jpg',
    'роман волков': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/barber-roman.jpg',
    'алексей петров': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/barber-alexey.jpg',
    'максим смирнов': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/barber-maxim.jpg'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);

  async function loadBarbers(targetId, limit = Infinity) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!window.novaDb) {
      target.innerHTML = '<p class="text-muted py-[20px]">Нет подключения к базе данных.</p>';
      return;
    }

    try {
      const { data, error } = await window.novaDb
        .from('barbers')
        .select('id,first_name,last_name,qualification,rating,branch_id,portfolio_url')
        .order('id');

      if (error) throw error;

      if (!data?.length) {
        target.innerHTML = '<p class="text-muted py-[20px]">Барберы пока не добавлены.</p>';
        return;
      }

      target.innerHTML = data.slice(0, limit).map(barber => {
        const name = [barber.first_name, barber.last_name]
          .filter(Boolean).join(' ');
        const key = name.trim().toLocaleLowerCase('ru-RU');
        const photo = images[key] || barber.portfolio_url || '';
        const rating = Number(barber.rating || 0).toFixed(1);

        return `
          <article class="flex flex-col">
            <div class="w-full aspect-[295/300] rounded-[12px] overflow-hidden bg-[#e2d7c6] mb-[16px]">
              ${photo
                ? `<img class="w-full h-full object-cover block" src="${esc(photo)}" alt="${esc(name)}" loading="lazy">`
                : '<div class="text-muted py-[20px] text-center">Добавь фото мастера</div>'}
            </div>
            <div class="flex flex-col flex-grow p-0">
              <div class="flex justify-between items-baseline mb-[4px]">
                <span class="text-[1.1rem] font-bold text-ink">${esc(name)}</span>
                <span class="text-[0.95rem] font-semibold text-ink flex items-center gap-1 before:content-['★'] before:text-ink before:text-[0.9rem]">${rating}</span>
              </div>
              <span class="text-muted text-[0.9rem] mb-[20px]">${esc(barber.qualification || 'Барбер')}</span>
              <a class="w-full mt-auto inline-flex items-center justify-center rounded-full px-[20px] py-[12px] bg-ink text-white text-[0.9rem] font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-[#39352f] hover:-translate-y-[2px]" href="booking.html?barber=${encodeURIComponent(barber.id)}">
                Записаться
              </a>
            </div>
          </article>
        `;
      }).join('');
    } catch (error) {
      console.error('Ошибка загрузки барберов:', error);
      target.innerHTML = '<p class="text-muted py-[20px]">Не удалось загрузить команду. Проверь настройки Supabase и права SELECT.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadBarbers('barberGrid');
    loadBarbers('homeBarbers', 4);
  });
})();
