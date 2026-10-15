/* js/auth.js — Логика входа и регистрации */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  // --- Переключение между табами ---
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      if (target === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
      }
      loginError.textContent = '';
      registerError.textContent = '';
    });
  });

  // --- ВХОД ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';

      const phone = document.getElementById('loginPhone').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!phone || !password) {
        loginError.textContent = 'Заполните все поля';
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Вход...';

      try {
        const { data, error } = await window.novaDb.functions.invoke('login-client', {
          body: { phone, password }
        });

        console.log('Ответ от login-client:', { data, error }); // Для отладки

        if (error) throw new Error(error.message || 'Ошибка входа');
        if (!data) throw new Error('Сервер вернул пустой ответ');
        if (data.error) throw new Error(data.error);
        if (!data.client) throw new Error('Не удалось получить данные клиента');

        // Сохраняем клиента в localStorage
        localStorage.setItem('nova_client', JSON.stringify(data.client));

        alert(`Добро пожаловать, ${data.client.first_name}!`);
        window.location.href = 'account.html';

      } catch (err) {
        console.error('Ошибка входа:', err);
        loginError.textContent = err.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // --- РЕГИСТРАЦИЯ ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.textContent = '';

      const first_name = document.getElementById('regFirstName').value.trim();
      const last_name = document.getElementById('regLastName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      if (!first_name || !phone || !password) {
        registerError.textContent = 'Заполните обязательные поля';
        return;
      }
      if (password.length < 6) {
        registerError.textContent = 'Пароль должен быть минимум 6 символов';
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Регистрация...';

      try {
        const { data, error } = await window.novaDb.functions.invoke('register-client', {
          body: { first_name, last_name, phone, email, password }
        });

        console.log('Ответ от register-client:', { data, error }); // Для отладки

        if (error) throw new Error(error.message || 'Ошибка регистрации');
        if (!data) throw new Error('Сервер вернул пустой ответ');
        if (data.error) throw new Error(data.error);
        if (!data.client) throw new Error('Не удалось получить данные клиента');

        // Сразу логиним после регистрации
        localStorage.setItem('nova_client', JSON.stringify(data.client));

        alert(`Регистрация успешна! Добро пожаловать, ${data.client.first_name}!`);
        window.location.href = 'account.html';

      } catch (err) {
        console.error('Ошибка регистрации:', err);
        registerError.textContent = err.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});