/* js/services.js — Логика страницы услуг */

(() => {
  const images = {
    'мужская стрижка': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-muzhskaya.jpg',
    'стрижка бороды и усов': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-boroda.jpg',
    'комплекс: стрижка + борода': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-kompleks.jpg',
    'детская стрижка': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-detskaya.jpg',
    'отец + сын': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-otec-syn.jpg',
    'камуфляж седины': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-kamuflyazh.jpg',
    'уход за лицом': 'https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/service-uhod.jpg'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);

  async function loadServices(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (!window.novaDb) {
      target.innerHTML = '<p class="text-muted py-[20px]">Нет подключения к базе данных.</p>';
      return;
    }

    try {
      const { data, error } = await window.novaDb
        .from('services')
        .select('id, title, price, duration_minutes')
        .order('id');

      if (error) throw error;

      if (!data?.length) {
        target.innerHTML = '<p class="text-muted py-[20px]">Услуги пока не добавлены.</p>';
        return;
      }

      target.innerHTML = data.map(service => {
        const key = (service.title || '').toLowerCase().trim();
        const photo = images[key] || 'images/service-placeholder.jpg';

        return `
          <article class="relative rounded-[16px] md:rounded-[20px] overflow-hidden min-h-[180px] md:min-h-[220px] flex flex-col justify-end p-[20px] bg-[#2a2622] text-white group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
            <img class="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-400 group-hover:scale-105" src="${esc(photo)}" alt="${esc(service.title)}" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/55 to-[#494949]/85 z-20 pointer-events-none" aria-hidden="true"></div>
            <div class="relative z-30 flex flex-col gap-1">
              <h3 class="text-[1.15rem] font-bold text-white m-0 mb-[6px] leading-[1.2]">${esc(service.title)}</h3>
              <p class="text-[0.85rem] text-white/75 m-0">${service.duration_minutes} мин</p>
              <p class="text-[1.05rem] font-bold text-white mt-[2px] mb-[14px]">${Number(service.price).toFixed(0)} ₽</p>
              <a class="self-start inline-flex items-center justify-center rounded-full px-[24px] py-[10px] bg-white text-ink text-[0.85rem] font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#e6e6e6]" href="booking.html?service=${service.id}">
                Выбрать
              </a>
            </div>
          </article>
        `;
      }).join('');

    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      target.innerHTML = '<p class="text-muted py-[20px]">Не удалось загрузить услуги.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadServices('serviceGrid');
  });
})();
