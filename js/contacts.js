document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('branchGrid');
  if (!grid) return;

  if (!window.novaDb) {
    grid.textContent = 'Нет подключения к базе данных.';
    return;
  }

  try {
    const { data, error } = await window.novaDb
      .from('branches')
      .select('id,address,phone,work_hours')
      .order('id');

    if (error) throw error;

    if (!data?.length) {
      grid.textContent = 'Филиалы пока не добавлены.';
      return;
    }

    const first = data[0];
    document.getElementById('contactAddress').textContent = first.address || 'Не указан';
    document.getElementById('contactHours').textContent = first.work_hours || 'Не указано';
    document.getElementById('contactPhone').textContent = first.phone || 'Не указан';

    grid.innerHTML = data.map(branch => `
      <article class="branch-item">
        <h3>${escapeText(branch.address || 'Филиал')}</h3>
        <p>${escapeText(branch.work_hours || 'Время работы не указано')}</p>
        <p>${escapeText(branch.phone || '')}</p>
      </article>
    `).join('');
  } catch (error) {
    console.error(error);
    grid.textContent = 'Не удалось загрузить филиалы из базы данных.';
  }
});

function escapeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  })[ch]);
}