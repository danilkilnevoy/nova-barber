(() => {
  const page = document.body.dataset.page || 'home';

  const links = [
    ['home', 'Главная', 'index.html'],
    ['services', 'Услуги', 'services.html'],
    ['barbers', 'Барберы', 'barbers.html'],
    ['booking', 'Онлайн-запись', 'booking.html'],
    ['contacts', 'Контакты', 'contacts.html']
  ];

  const header = document.querySelector('#siteHeader');
  if (header) {
    header.className = 'min-h-[82px] px-5 py-4 md:px-[max(28px,calc((100vw-1320px)/2))] md:py-[18px] flex items-center justify-between gap-3 md:gap-6 relative md:static flex-wrap md:flex-nowrap';
    header.innerHTML = `
      <a class="inline-flex items-center text-[1.25rem] font-black tracking-[0.06em] whitespace-nowrap text-ink" href="index.html" aria-label="NOVA BARBER">
        <img src="https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/logo.png" alt="NOVA BARBER" class="h-[40px] md:h-[56px] w-auto block object-contain">
      </a>

      <button class="hidden max-md:inline-flex ml-auto border border-line bg-transparent rounded-[12px] px-[12px] py-[8px] cursor-pointer text-ink text-base leading-none items-center justify-center" id="menuToggle"
        type="button" aria-label="Открыть меню"
        aria-expanded="false" aria-controls="mainNav">☰</button>

      <nav id="mainNav" class="w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-[26px] py-2 md:py-0 hidden md:flex" aria-label="Основная навигация">
        ${links.map(([id, label, url]) => `
          <a href="${url}" class="block md:inline text-[0.92rem] py-[10px] px-[4px] md:p-0 transition-colors ${page === id ? 'text-ink font-bold' : 'text-[#514a41] hover:text-ink hover:font-bold'}" ${page === id ? 'aria-current="page"' : ''}>
            ${label}
          </a>
        `).join('')}
      </nav>

      <a class="inline-flex items-center justify-center rounded-full bg-ink text-white font-[650] border border-ink px-[14px] py-[10px] text-[0.85rem] md:px-[23px] md:py-[13px] md:text-[15px] cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#39352f]" href="account.html">
        Личный кабинет
      </a>
    `;
  }

  const footer = document.querySelector('#siteFooter');
  if (footer) {
    footer.className = 'flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-5 px-5 py-6 md:px-[max(28px,calc((100vw-1320px)/2))] md:py-[30px] border-t border-line text-muted';
    footer.innerHTML = `
      <a class="inline-flex items-center text-[1.25rem] font-black tracking-[0.06em] whitespace-nowrap text-ink" href="index.html" aria-label="NOVA BARBER">
        <img src="https://ktpufaywlfrhxdltnczr.supabase.co/storage/v1/object/public/images/logo.png" alt="NOVA BARBER" class="h-[32px] md:h-[42px] w-auto block object-contain">
      </a>
      <span class="text-[0.95rem]">Твоя стрижка. Твой барбер.</span>
      <span class="text-[0.95rem]">© ${new Date().getFullYear()} NOVA BARBER</span>
    `;
  }

  const toggle = document.querySelector('#menuToggle');
  const nav = document.querySelector('#mainNav');

  toggle?.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(opened));
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
})();
