// Copies the deployable files into dist/ (the Netlify publish directory).
import { cp, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ship = ['index.html', 'demo.html', 'privacy.html', 'terms.html', 'robots.txt', 'sitemap.xml', 'assets'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const f of ship) await cp(path.join(root, f), path.join(dist, f), { recursive: true });
console.log(`built dist/ (${ship.join(', ')})`);
