/* js/account.js — Логика личного кабинета */

document.addEventListener('DOMContentLoaded', async () => {
  // --- 1. ПРОВЕРКА АВТОРИЗАЦИИ ---
  const clientData = localStorage.getItem('nova_client');
  
  if (!clientData) {
    // Если клиент не авторизован — показываем сообщение
    document.getElementById('accountGreeting').textContent = 'Войдите, чтобы увидеть свои данные.';
    document.getElementById('profileName').textContent = 'Гость';
    document.getElementById('profileEmail').textContent = 'Вход не выполнен';
    document.getElementById('bonusBalance').textContent = '—';
    
    // Скрываем кнопку "Выйти", если не авторизован
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    return;
  }

  // Парсим данные клиента
  let client;
  try {
    client = JSON.parse(clientData);
  } catch (e) {
    console.error('Ошибка чтения данных клиента:', e);
    localStorage.removeItem('nova_client');
    window.location.reload();
    return;
  }

  // --- 2. ОТОБРАЖЕНИЕ ДАННЫХ ПРОФИЛЯ ---
  const fullName = [client.first_name, client.last_name].filter(Boolean).join(' ');
  
  document.getElementById('accountGreeting').textContent = `Привет, ${client.first_name}! Рады видеть тебя снова.`;
  document.getElementById('profileName').textContent = fullName || 'Клиент';
  document.getElementById('profileEmail').textContent = client.email || client.phone || 'Email не указан';
  document.getElementById('bonusBalance').textContent = `${Number(client.bonus_balance || 0).toFixed(0)} ₽`;

  // Меняем аватар на первую букву имени
  const avatarEl = document.querySelector('.avatar');
  if (avatarEl && client.first_name) {
    avatarEl.textContent = client.first_name.charAt(0).toUpperCase();
  }

  // Меняем кнопку "Войти" на "Записаться"
  const profileBtn = document.querySelector('.profile-card .pill-button') || document.querySelector('.pill-button');
  if (profileBtn) {
    profileBtn.textContent = 'Записаться онлайн';
    profileBtn.href = 'booking.html';
  }

  // --- 3. ЗАГРУЗКА ВИЗИТОВ ИЗ БАЗЫ ---
  await loadVisits(client.id);

  // --- 4. ОБРАБОТКА КНОПКИ "ВЫЙТИ" ---
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('nova_client');
        window.location.href = 'index.html';
      }
    });
  }
});


// --- ФУНКЦИЯ ЗАГРУЗКИ ВИЗИТОВ ---
async function loadVisits(clientId) {
  const upcomingEl = document.getElementById('upcomingVisits');
  const historyEl = document.getElementById('visitHistory');

  if (!window.novaDb) {
    upcomingEl.innerHTML = '<p class="text-muted py-[20px]">Нет подключения к базе данных.</p>';
    historyEl.innerHTML = '<p class="text-muted py-[20px]">Нет подключения к базе данных.</p>';
    return;
  }

  try {
    // Загружаем все бронирования клиента с информацией об услуге и барбере
    const { data, error } = await window.novaDb
      .from('bookings')
      .select(`
        id,
        start_time,
        end_time,
        total_price,
        status,
        barbers (first_name, last_name),
        services (title, price)
      `)
      .eq('client_id', clientId)
      .order('start_time', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      upcomingEl.innerHTML = '<p class="text-muted">У вас пока нет записей. <a href="booking.html" class="underline">Записаться</a></p>';
      historyEl.innerHTML = '<p class="text-muted">История визитов пуста.</p>';
      return;
    }

    // Разделяем визиты на предстоящие и прошедшие
    const now = new Date();
    const upcoming = [];
    const past = [];

    data.forEach(booking => {
      const visitDate = new Date(booking.start_time);
      if (visitDate >= now && booking.status !== 'Отменена') {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    // Рендерим предстоящие (сортируем по возрастанию даты — ближайшие сверху)
    if (upcoming.length === 0) {
      upcomingEl.innerHTML = '<p class="text-muted">Нет предстоящих визитов. <a href="booking.html" class="underline">Записаться</a></p>';
    } else {
      upcoming.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      upcomingEl.innerHTML = upcoming.map(renderVisit).join('');
    }

    // Рендерим историю (уже отсортирована по убыванию)
    if (past.length === 0) {
      historyEl.innerHTML = '<p class="text-muted">История визитов пуста.</p>';
    } else {
      historyEl.innerHTML = past.map(renderVisit).join('');
    }

  } catch (error) {
    console.error('Ошибка загрузки визитов:', error);
    upcomingEl.innerHTML = '<p class="text-muted py-[20px]">Не удалось загрузить визиты.</p>';
    historyEl.innerHTML = '<p class="text-muted py-[20px]">Не удалось загрузить историю.</p>';
  }
}


// --- ФУНКЦИЯ РЕНДЕРА ОДНОГО ВИЗИТА ---
function renderVisit(booking) {
  const date = new Date(booking.start_time);
  
  // Форматируем дату: "15 октября 2026, 14:30"
  const dateStr = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const barberName = booking.barbers 
    ? `${booking.barbers.first_name} ${booking.barbers.last_name || ''}`.trim()
    : 'Барбер не указан';

  const serviceTitle = booking.services?.title || 'Услуга';
  const price = booking.total_price ? `${Number(booking.total_price).toFixed(0)} ₽` : '';

  // Цвет статуса
  let statusClass = 'text-[0.8rem] px-[12px] py-[4px] rounded-full font-semibold whitespace-nowrap';
  if (booking.status === 'Отменена') statusClass += ' bg-[#fdecea] text-[#c0392b]';
  else if (booking.status === 'Завершена') statusClass += ' bg-[#eaeaea] text-[#666]';
  else statusClass += ' bg-[#e6f4ea] text-[#1e7e34]';

  return `
    <div class="py-[18px] border-b border-line last:border-b-0">
      <div class="flex justify-between items-center gap-[12px] mb-[6px] flex-wrap">
        <b class="text-[1rem] font-bold">${dateStr}, ${timeStr}</b>
        <span class="${statusClass}">${booking.status || 'Создана'}</span>
      </div>
      <p class="m-0 text-muted text-[0.92rem]">${serviceTitle} · ${barberName} ${price ? '· ' + price : ''}</p>
    </div>
  `;
}
