/* js/booking.js — Логика формы онлайн-записи (адаптировано под booking.html) */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. ПОИСК ЭЛЕМЕНТОВ (с вашими реальными ID) ---
  const serviceSelect = document.getElementById('serviceSelect');
  const branchSelect = document.getElementById('branchSelect');
  const barberSelect = document.getElementById('barberSelect');
  const dateInput = document.getElementById('bookingDate');      // ← было dateInput
  const timeSelect = document.getElementById('bookingTime');     // ← было timeSelect

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');

  const summaryService = document.getElementById('selectedService'); // ← блок «Стоимость и длительность…»
  const summaryBlock = document.getElementById('bookingSummary');    // ← блок «Итого»
  const bookingForm = document.getElementById('bookingForm');

  if (!bookingForm) return;

  let allBarbers = [];
  let currentPrice = 0;
  let currentServiceTitle = '';

  // --- 2. ЗАГРУЗКА УСЛУГ ---
  async function loadServices() {
    if (!window.novaDb) {
      console.error('window.novaDb не найден');
      return;
    }

    serviceSelect.innerHTML = '<option value="">Загрузка услуг…</option>';

    const { data, error } = await window.novaDb
      .from('services')
      .select('id, title, price, duration_minutes')
      .order('title');

    if (error) {
      console.error('Ошибка загрузки услуг:', error);
      serviceSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
      return;
    }

    serviceSelect.innerHTML = '<option value="">Выберите услугу</option>';
    data.forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = `${service.title} — ${service.price} ₽`;
      option.dataset.price = service.price;
      option.dataset.duration = service.duration_minutes;
      option.dataset.title = service.title;
      serviceSelect.appendChild(option);
    });
  }

  // --- 3. ЗАГРУЗКА ФИЛИАЛОВ ---
  async function loadBranches() {
    if (!window.novaDb) return;

    branchSelect.innerHTML = '<option value="">Загрузка филиалов…</option>';

    const { data, error } = await window.novaDb
      .from('branches')
      .select('id, address')
      .order('address');

    if (error) {
      console.error('Ошибка загрузки филиалов:', error);
      branchSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
      return;
    }

    branchSelect.innerHTML = '<option value="">Выберите филиал</option>';
    data.forEach(branch => {
      const option = document.createElement('option');
      option.value = branch.id;
      option.textContent = branch.address;
      branchSelect.appendChild(option);
    });
  }

  // --- 4. ЗАГРУЗКА БАРБЕРОВ ---
  async function loadAllBarbers() {
    if (!window.novaDb) return;

    const { data, error } = await window.novaDb
      .from('barbers')
      .select('id, first_name, last_name, branch_id')
      .order('first_name');

    if (error) {
      console.error('Ошибка загрузки барберов:', error);
      return;
    }

    allBarbers = data;
  }

  function filterBarbersByBranch(branchId) {
    barberSelect.innerHTML = '<option value="">Выберите барбера</option>';

    if (!branchId) {
      barberSelect.innerHTML = '<option value="">Сначала выберите филиал</option>';
      return;
    }

    const filtered = allBarbers.filter(b => b.branch_id == branchId);

    if (filtered.length === 0) {
      barberSelect.innerHTML = '<option value="">Нет барберов в этом филиале</option>';
      return;
    }

    filtered.forEach(barber => {
      const option = document.createElement('option');
      option.value = barber.id;
      option.textContent = `${barber.first_name} ${barber.last_name}`;
      barberSelect.appendChild(option);
    });
  }

  // --- 5. ГЕНЕРАЦИЯ ВРЕМЕННЫХ СЛОТОВ ---
  function generateTimeSlots() {
    timeSelect.innerHTML = '<option value="">Выбери время</option>';

    const date = dateInput.value;
    if (!date) return;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      timeSelect.innerHTML = '<option value="">Дата уже прошла</option>';
      return;
    }

    const startHour = 10;
    const endHour = 20;
    const stepMinutes = 30;

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const now = new Date();

    let count = 0;
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += stepMinutes) {
        if (isToday) {
          const slotTime = new Date();
          slotTime.setHours(hour, minutes, 0, 0);
          if (slotTime <= now) continue;
        }

        const timeStr = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const option = document.createElement('option');
        option.value = timeStr;
        option.textContent = timeStr;
        timeSelect.appendChild(option);
        count++;
      }
    }

    if (count === 0) {
      timeSelect.innerHTML = '<option value="">Нет доступного времени</option>';
    }
  }

  // --- 6. ОБРАБОТЧИКИ ---

  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      const price = selectedOption.dataset.price;
      const title = selectedOption.dataset.title;
      const duration = selectedOption.dataset.duration;

      if (price) {
        currentPrice = parseFloat(price);
        currentServiceTitle = title;

        // Обновляем блок «Стоимость и длительность появятся здесь»
        if (summaryService) {
          summaryService.textContent = `${title} · ${price} ₽ · ${duration} мин`;
        }

        // Обновляем блок «Итого»
        if (summaryBlock) {
          summaryBlock.innerHTML = `<span>Итого</span><b>${title} — ${price} ₽</b>`;
        }
      } else {
        currentPrice = 0;
        currentServiceTitle = '';
        if (summaryService) summaryService.textContent = 'Стоимость и длительность появятся здесь';
        if (summaryBlock) summaryBlock.innerHTML = '<span>Итого</span><b>Выбери услугу</b>';
      }
    });
  }

  if (branchSelect) {
    branchSelect.addEventListener('change', (e) => {
      filterBarbersByBranch(e.target.value);
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', generateTimeSlots);
  }

  // --- 7. ОТПРАВКА ФОРМЫ ---
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceId = serviceSelect.value;
    const branchId = branchSelect.value;
    const barberId = barberSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    if (!serviceId || !branchId || !barberId || !date || !time) {
      alert('Пожалуйста, выберите услугу, филиал, барбера, дату и время.');
      return;
    }
    if (!firstName || !phone) {
      alert('Пожалуйста, укажите ваше имя и телефон.');
      return;
    }

    const startTime = `${date}T${time}:00`;

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Отправка...';

    try {
      const { data, error } = await window.novaDb.functions.invoke('create-booking', {
        body: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email,
          barber_id: parseInt(barberId),
          service_id: parseInt(serviceId),
          start_time: startTime,
          total_price: currentPrice
        }
      });

      console.log('Ответ от create-booking:', { data, error });

      if (error) throw new Error(error.message || 'Ошибка отправки');
      if (!data) throw new Error('Сервер вернул пустой ответ');
      if (data.error) throw new Error(data.error);

      alert('Вы успешно записаны! Ждем вас.');
      bookingForm.reset();
      if (summaryService) summaryService.textContent = 'Стоимость и длительность появятся здесь';
      if (summaryBlock) summaryBlock.innerHTML = '<span>Итого</span><b>Выбери услугу</b>';
      timeSelect.innerHTML = '<option value="">Выбери время</option>';
      currentPrice = 0;
      currentServiceTitle = '';

    } catch (err) {
      console.error('Ошибка бронирования:', err);
      alert('Ошибка: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // --- 8. ИНИЦИАЛИЗАЦИЯ ---
  loadServices();
  loadBranches();
  loadAllBarbers();
});