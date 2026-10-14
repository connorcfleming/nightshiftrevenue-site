// node scripts/form-test.mjs <baseUrl> <expect: ok|err>
import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const [base, expect] = process.argv.slice(2);
const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9800 + Math.floor(Math.random() * 150);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${await mkdtemp(path.join(os.tmpdir(), 'nsr-ft-'))}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x => x.type === 'page'); } catch { await sleep(200); } }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.navigate', { url: base }); await sleep(1500);
const results = [];
for (const sel of ['.quick', '.audit-form']) {
  await ev(`(() => { const f = document.querySelector('${sel}');
    const set = (n, v) => { const el = f.querySelector('[name=' + n + ']'); if (el) el.value = v; };
    set('name', 'Test Owner'); set('email', 'owner@example.com'); set('business', 'Example Co'); set('industry', 'Solar'); set('database_size', 'Not sure');
    f.requestSubmit(); return true; })()`);
  await sleep(800);
  results.push(await ev(`(() => { const s = document.querySelector('${sel} .form-status'); return { cls: s.className, text: s.textContent, name: document.querySelector('${sel} [name=name]').value }; })()`));
}
// empty required fields must block submission
const blocked = await ev(`(() => { const f = document.querySelector('.audit-form'); f.querySelector('[name=name]').value=''; return !f.checkValidity(); })()`);
console.log(JSON.stringify({ results, requiredBlocks: blocked }, null, 1));
const pass = results.every(r => r.cls.includes(expect)) && blocked && results.every(r => expect === 'ok' ? r.name === '' : r.name === 'Test Owner');
console.log(pass ? 'PASS' : 'FAIL'); ws.close(); proc.kill(); process.exit(pass ? 0 : 1);
