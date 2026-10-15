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
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="NOVA BARBER">
        <img src="images/logo.png" alt="NOVA BARBER" class="brand-logo">
      </a>

      <button class="menu-toggle" id="menuToggle"
        type="button" aria-label="Открыть меню"
        aria-expanded="false" aria-controls="mainNav">☰</button>

      <nav id="mainNav" aria-label="Основная навигация">
        ${links.map(([id, label, url]) => `
          <a href="${url}" ${page === id ? 'aria-current="page"' : ''}>
            ${label}
          </a>
        `).join('')}
      </nav>

      <a class="pill-button header-account" href="account.html">
        Личный кабинет
      </a>
    `;
  }

  const footer = document.querySelector('#siteFooter');
  if (footer) {
    footer.innerHTML = `
      <a class="brand" href="index.html" aria-label="NOVA BARBER">
        <img src="images/logo.png" alt="NOVA BARBER" class="brand-logo brand-logo-footer">
      </a>
      <span>Твоя стрижка. Твой барбер.</span>
      <span>© ${new Date().getFullYear()} NOVA BARBER</span>
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