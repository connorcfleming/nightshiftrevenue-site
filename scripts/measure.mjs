// node scripts/measure.mjs <url> <width>  -> rendered spacing report (JSON)
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const [url, w = '1440'] = process.argv.slice(2);
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9600 + Math.floor(Math.random() * 150);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${await mkdtemp(path.join(os.tmpdir(), 'nsr-m-'))}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page'); } catch { await sleep(200); } }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const W = Number(w);
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 600 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url }); await sleep(2000);
const expr = `(() => {
  const r = el => el.getBoundingClientRect();
  const px = v => Math.round(parseFloat(v));
  const out = { sections: [], insets: [], stacks: [] };
  // 1. section rhythm: rule -> heading, heading -> sub, head -> content, content -> next rule
  document.querySelectorAll('main > section').forEach(s => {
    const cs = getComputedStyle(s), sr = r(s);
    const h = s.querySelector('h1, h2'); const head = s.querySelector('.section-head, .hero-top, .demo-copy');
    const sub = head && head.querySelector('p');
    const kids = [...s.children]; const last = kids[kids.length - 1];
    const after = head && head.nextElementSibling;
    out.sections.push({
      cls: s.className, padTop: px(cs.paddingTop), padBot: px(cs.paddingBottom),
      ruleToHeading: h ? Math.round(r(h).top - sr.top) : null,
      headingToSub: h && sub ? Math.round(r(sub).top - r(h).bottom) : null,
      headToContent: after && head && getComputedStyle(s).display !== 'grid' || (after && r(after).top > r(head).bottom) ? Math.round(r(after).top - r(head).bottom) : 'side-by-side',
      contentToEnd: Math.round(sr.bottom - Math.max(...kids.map(k => r(k).bottom))),
    });
  });
  // 2. bordered / filled containers: text inset from visible edge
  const boxes = document.querySelectorAll('.deal, .demo-form, .contact-card, .hero-tray, .msg span, .strip, .track li, .magnet, .ghost-btn, .field input, .draft-flag, .faq summary, .stations li, .fit-cols > div, .rules li, .pose-facts div');
  boxes.forEach(b => {
    const cs = getComputedStyle(b);
    out.insets.push({ el: b.className || b.tagName, text: (b.textContent || '').trim().slice(0, 24), pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px).join('/'), h: Math.round(r(b).height), w: Math.round(r(b).width) });
  });
  // 3. vertical gaps between consecutive siblings in key stacks
  ['.hero', '.hero-top', '.hero-tray .quick', '.pose', '.answer', '.thread', '.stations li', '.deal', '.deals', '.fit-cols > div', '.after-cols article', '.demo-copy', '.demo-form', '.doc-body', '.tray-body', '.section-head', '.clock'].forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (i > 1) return;
      const kids = [...el.children].filter(k => getComputedStyle(k).display !== 'none' && r(k).height > 0 && !k.classList.contains('hp'));
      const gaps = []; for (let j = 1; j < kids.length; j++) { const a = r(kids[j-1]), b = r(kids[j]); if (b.top >= a.bottom - 1) gaps.push(Math.round(b.top - a.bottom)); else gaps.push('row'); }
      out.stacks.push({ sel: sel + (i ? '#' + i : ''), kids: kids.map(k => (k.className || k.tagName).toString().split(' ')[0]).join(','), gaps: gaps.join(' ') });
    });
  });
  out.doc = { scrollW: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight };
  return JSON.stringify(out);
})()`;
const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
const o = JSON.parse(res.result.result.value);
console.log(`== ${url} @ ${W}  doc ${JSON.stringify(o.doc)}`);
console.log('-- sections (px)'); o.sections.forEach(s => console.log(JSON.stringify(s)));
console.log('-- container insets (padding T/R/B/L)'); o.insets.forEach(s => console.log(JSON.stringify(s)));
console.log('-- stacks (gaps between children)'); o.stacks.forEach(s => console.log(JSON.stringify(s)));
ws.close(); proc.kill();
