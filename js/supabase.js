(() => {
  const config = window.NOVA_CONFIG;

  if (!window.supabase || !config?.SUPABASE_URL || !config?.SUPABASE_KEY) {
    console.error('Supabase не загружен. Проверь подключение и config.js.');
    window.novaDb = null;
    return;
  }

  window.novaDb = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_KEY
  );
})();