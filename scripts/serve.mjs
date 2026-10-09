// Local static server. `node scripts/serve.mjs [--mock-forms] [--port 4180]`
// Without --mock-forms, form POSTs return 501 so the page shows its error state.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const mockForms = args.includes('--mock-forms');
const port = Number(args[args.indexOf('--port') + 1]) || 4180;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.txt': 'text/plain' };
const routes = { '/': '/index.html', '/privacy': '/privacy.html', '/terms': '/terms.html' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      if (mockForms) { console.log('[mock form]', Object.fromEntries(new URLSearchParams(body))); res.writeHead(200); res.end('ok'); }
      else { res.writeHead(501); res.end('forms are handled by Netlify'); }
    });
    return;
  }
  const rel = routes[url.pathname] || url.pathname;
  const file = path.join(root, path.normalize(rel).replace(/^([\/])+/, ''));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    if ((await stat(file)).isDirectory()) throw new Error('dir');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/${mockForms ? '  (mock forms on)' : ''}`));
