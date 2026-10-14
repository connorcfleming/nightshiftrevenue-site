(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };

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

  /* ---------- Header: border once scrolled, menu under 900px ---------- */
  const head = $('.site-head');
  if (head) {
    const onScroll = () => head.classList.toggle('is-stuck', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    const setOpen = open => { toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
  }

  /* ---------- Hero: the windows light up once, just before the street is seen ---------- */
  const street = $('.street');
  if (street && !reduceMotion) {
    if (inView(street) || !('IntersectionObserver' in window)) street.classList.add('is-waking');
    else {
      const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { io.disconnect(); street.classList.add('is-waking'); }
      }, { rootMargin: '0px 0px 120px 0px' });
      io.observe(street);
    }
  }

  /* ---------- One lead coming back ----------
     The thread is complete by default. It only plays if it hasn't been seen yet;
     hidden messages keep their space, so nothing below moves. */
  const thread = $('[data-thread]');
  const track = $('.track');
  const replay = $('[data-replay]');
  const msgs = thread ? $$('.msg', thread) : [];
  let timers = [];

  function setStage(n) {
    if (!track) return;
    $$('li', track).forEach(li => li.classList.toggle('is-on', Number(li.dataset.stage) <= n));
  }

  function showAll() {
    timers.forEach(clearTimeout); timers = [];
    thread.classList.remove('is-pending');
    msgs.forEach(m => m.classList.remove('is-shown'));
    setStage(3);
    if (replay) replay.disabled = false;
  }

  function play() {
    timers.forEach(clearTimeout); timers = [];
    thread.classList.add('is-pending');
    msgs.forEach(m => m.classList.remove('is-shown'));
    setStage(0);
    if (replay) replay.disabled = true;
    msgs.forEach((m, i) => {
      timers.push(setTimeout(() => {
        m.classList.add('is-shown');
        setStage(Number(m.dataset.stage));
        if (i === msgs.length - 1) timers.push(setTimeout(showAll, 500));
      }, 250 + i * 540));
    });
  }

  if (thread) {
    setStage(3);
    if (!reduceMotion && 'IntersectionObserver' in window) {
      if (replay) { replay.hidden = false; replay.addEventListener('click', play); }
      if (!inView(thread)) {
        thread.classList.add('is-pending');
        setStage(0);
        const io = new IntersectionObserver(entries => {
          if (entries.some(e => e.isIntersecting)) { io.disconnect(); play(); }
        }, { threshold: 0.3 });
        io.observe(thread);
      }
    }
  }

  /* ---------- Audit forms (Netlify Forms) ---------- */
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
        status.textContent = "Thanks. We'll reach out within one business day to set up your audit.";
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
