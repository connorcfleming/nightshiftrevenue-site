// Screenshots via headless Chrome + DevTools protocol (no dependencies).
// node scripts/shoot.mjs <url> <out.png> <width> [height|full] [--motion]
import { spawn } from 'node:child_process';
import { writeFile, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const [url, out, w = '1440', h = 'full'] = process.argv.slice(2);
const motion = process.argv.includes('--motion');
const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = await mkdtemp(path.join(os.tmpdir(), 'nsr-shot-'));
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let target;
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page'); } catch { await sleep(200); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('console.error ' + m.params.args.map(a => a.value).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('log ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
const W = Number(w); const H = h === 'full' ? 900 : Number(h);
const mobile = W < 600;
const dpr = mobile && h !== 'full' ? 2 : 1;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: dpr, mobile });
if (!motion) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url });
await sleep(2500);
await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
let clip;
if (h === 'full') {
  const r = await send('Runtime.evaluate', { expression: 'Math.ceil(document.documentElement.scrollHeight)', returnByValue: true });
  const fullH = r.result.result.value;
  if (process.argv.includes('--resize')) await send('Emulation.setDeviceMetricsOverride', { width: W, height: fullH, deviceScaleFactor: dpr, mobile });
  await sleep(600);
  clip = { x: 0, y: 0, width: W, height: fullH, scale: 1 };
}
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!clip, ...(clip ? { clip } : {}) });
await writeFile(out, Buffer.from(shot.result.data, 'base64'));
const ov = await send('Runtime.evaluate', { expression: `JSON.stringify({ scrollH: document.documentElement.scrollHeight, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, innerW: innerWidth, frameML: getComputedStyle(document.querySelector(".frame")).marginLeft, h1: getComputedStyle(document.querySelector("h1")).fontSize, mq640: matchMedia("(max-width: 640px)").matches })`, returnByValue: true });
console.log(out, ov.result.result.value, logs.length ? logs.join('\n') : 'no console errors');
ws.close(); proc.kill();
