(() => {
  const STORAGE_KEY = 'relpek-theme';
  const root = document.documentElement;

  const readTheme = () => {
    try { return localStorage.getItem(STORAGE_KEY) || 'light'; }
    catch { return 'light'; }
  };
  const writeTheme = (t) => {
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  };
  const applyTheme = (t) => { root.dataset.theme = t; };

  applyTheme(readTheme());

  const initThemeToggle = () => {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = readTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      writeTheme(next);
    });
  };

  const initReveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  };

  const initYear = () => {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  };

  const initWordRotate = () => {
    const el = document.querySelector('[data-rotate]');
    if (!el) return;
    const words = (el.dataset.words || el.textContent)
      .split(',')
      .map(w => w.trim())
      .filter(Boolean);
    if (words.length < 2) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      if (reduce) { el.textContent = words[i]; return; }
      el.classList.add('is-flipping');
      el.addEventListener('transitionend', () => {
        el.textContent = words[i];
        el.classList.remove('is-flipping');
      }, { once: true });
    }, 15000);
  };

  const start = () => {
    initThemeToggle();
    initReveal();
    initYear();
    initWordRotate();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
