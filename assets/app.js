(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Config: booking link, contact, operator ---------- */
  const isSet = v => typeof v === 'string' && v.trim() && !v.includes('[VERIFY]');

  fetch('/site.config.json', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error('config'))))
    .then(applyConfig)
    .catch(() => { /* static fallback copy already in the page */ });

  function applyConfig(cfg) {
    const c = cfg.contact || {};
    if (isSet(c.mainLineE164)) $$('[data-phone]').forEach(a => { a.href = `tel:${c.mainLineE164}`; });
    if (isSet(c.email)) {
      const line = $('[data-email-line]');
      const link = $('[data-email]');
      if (line && link) { link.href = `mailto:${c.email}`; link.textContent = c.email; line.hidden = false; }
    }
    const op = cfg.operator || {};
    if (isSet(op.legalName)) $$('[data-legal]').forEach(el => { el.textContent = op.legalName; });
    if (isSet(op.address)) $$('[data-address]').forEach(el => { el.textContent = op.address; });

    const url = cfg.booking && cfg.booking.url;
    if (isSet(url) && /^https:\/\//.test(url)) {
      const line = $('[data-calendar-line]');
      const link = $('[data-calendar]');
      if (line && link) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; line.hidden = false; }
    }
  }

  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Hero: old leads rewritten in fresh marker ---------- */
  const ledger = $('.ledger');
  if (ledger && !reduceMotion) {
    $$('.live', ledger).forEach((row, r) => {
      $$('.ink', row).forEach((ink, c) => { ink.style.setProperty('--d', String(350 + r * 520 + c * 170)); });
    });
    ledger.classList.add('is-pre');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ledger.classList.add('is-writing');
      ledger.classList.remove('is-pre');
    }));
  }

  /* ---------- One lead coming back: the conversation plays ---------- */
  const thread = $('[data-thread]');
  const track = $('.track');
  const replay = $('[data-replay]');
  const msgs = thread ? $$('.msg', thread) : [];
  let timers = [];

  function setStage(n) {
    if (!track) return;
    $$('li', track).forEach(li => {
      const s = Number(li.dataset.stage);
      li.classList.toggle('is-on', s <= n);
      li.classList.toggle('is-now', s === n);
    });
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; $$('.typing', thread).forEach(t => t.remove()); }

  function showAll() {
    clearTimers();
    msgs.forEach(m => m.classList.remove('is-hidden', 'is-new'));
    setStage(3);
  }

  function play() {
    clearTimers();
    msgs.forEach(m => { m.classList.add('is-hidden'); m.classList.remove('is-new'); });
    setStage(0);
    if (replay) replay.disabled = true;
    let t = 300;
    msgs.forEach((m, idx) => {
      const out = m.classList.contains('out');
      const typeFor = idx === 0 ? 700 : Math.min(1600, 500 + m.textContent.length * 9);
      timers.push(setTimeout(() => {
        const dots = document.createElement('div');
        dots.className = `typing ${out ? 'out' : 'in'}`;
        dots.setAttribute('aria-hidden', 'true');
        dots.innerHTML = '<i></i><i></i><i></i>';
        m.before(dots);
      }, t));
      t += typeFor;
      timers.push(setTimeout(() => {
        $$('.typing', thread).forEach(d => d.remove());
        m.classList.remove('is-hidden');
        m.classList.add('is-new');
        setStage(Number(m.dataset.stage));
        if (idx === msgs.length - 1 && replay) replay.disabled = false;
      }, t));
      t += 450;
    });
  }

  if (thread) {
    showAll();
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', play);
    }
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { io.disconnect(); play(); }
      }, { threshold: 0.35 });
      io.observe(thread);
    }
  }

  /* ---------- Demo forms (Netlify Forms) ---------- */
  const encode = data => new URLSearchParams(data).toString();

  $$('form[data-form]').forEach(form => {
    const status = $('.form-status', form);
    const button = $('button[type="submit"]', form);
    const label = button ? button.textContent : '';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('company_website')) return;
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      status.className = 'form-status';
      status.textContent = '';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        status.classList.add('ok');
        status.textContent = "Thanks. We'll reach out within one business day to set a time.";
        $$('input:not([type=hidden]):not([type=checkbox]), textarea, select', form).forEach(el => { el.value = ''; });
        $$('input[type=checkbox]', form).forEach(el => { el.checked = false; });
        if (button) button.textContent = 'Request sent';
      } catch (err) {
        status.classList.add('err');
        status.textContent = "That didn't go through. Your details are still here, so try again, or call or text our main line, 404-276-6462.";
        if (button) { button.disabled = false; button.textContent = label; }
      }
    });
  });
})();
