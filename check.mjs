// Launch gate. `node check.mjs` fails while [VERIFY] placeholders, banned claims,
// missing required copy or broken local links remain. `--allow-verify` reports
// placeholders without failing (for local review only).
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const allowVerify = process.argv.includes('--allow-verify');
const pages = ['index.html', 'privacy.html', 'terms.html'];
const files = [...pages, 'assets/app.js', 'site.config.json'];
const text = Object.fromEntries(await Promise.all(files.map(async f => [f, await readFile(path.join(root, f), 'utf8')])));
const visible = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');

const fails = [];
const warns = [];

// 1. Placeholders
for (const f of files.filter(f => f !== 'assets/app.js')) {
  const n = (text[f].match(/\[(VERIFY|FOUNDER NAME|PHOTO|CITY|WHY I DO THIS)/g) || []).length;
  if (n) (allowVerify ? warns : fails).push(`${f}: ${n} placeholder(s) ([VERIFY] or founder details)`);
}

// 2. Claims we can't back up (no proof exists yet)
const banned = [
  /testimonial/i, /case stud/i, /guarantee/i, /\d+\s?%/, /\bROI\b/, /\d+x\b/i, /\bproven\b/i,
  /trusted by/i, /clients say/i, /five[- ]star|5[- ]star/i, /#1\b/, /top[- ]rated/i, /\bbest in\b/i,
  /money[- ]back/i, /Connor|Fleming/i, /risk[- ]free/i, /average (client|customer)s? (see|get)/i,
];
for (const f of [...pages, 'assets/app.js']) {
  const body = f.endsWith('.html') ? visible(text[f]) : text[f];
  for (const re of banned) if (re.test(body)) fails.push(`${f}: banned claim pattern ${re}`);
}

// 3. Required copy
const must = {
  'index.html': [
    'Get my free lead audit', 'id="night"', 'id="pricing"', 'id="fit"', 'id="after-hours"', 'id="audit"', 'id="consent"', 'id="founder"',
    'Pay per booked appointment', 'Revenue share', 'Speed to lead', 'After-hours follow-up',
    'Illustrative example', 'Reply STOP to opt out', 'Consent is not a condition of purchase',
    'Message and data rates may apply', 'HELP for help', 'href="/privacy"', 'href="/terms"', 'data-netlify="true"', 'netlify-honeypot',
  ],
  'privacy.html': ['do not sell, rent or share your mobile number', 'Reply STOP', 'Placeholder'],
  'terms.html': ['Message and data rates may apply', 'reply HELP', 'not a condition of purchase', 'Carriers are not liable', 'Placeholder'],
};
for (const [f, list] of Object.entries(must)) for (const s of list) if (!text[f].toLowerCase().includes(s.toLowerCase())) fails.push(`${f}: missing "${s}"`);

// 4. Every demo form has the same Netlify name and a honeypot
const forms = text['index.html'].match(/<form[^>]*>/g) || [];
for (const tag of forms) if (!/name="demo"/.test(tag) || !/netlify-honeypot="company_website"/.test(tag)) fails.push(`index.html: form not wired to Netlify "demo": ${tag}`);

// 5. Local links and assets resolve
const routes = { '/': 'index.html', '/privacy': 'privacy.html', '/terms': 'terms.html' };
for (const f of pages) {
  for (const [, ref] of text[f].matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = routes[ref] || ref.slice(1);
    try { await access(path.join(root, target)); } catch { fails.push(`${f}: broken link ${ref}`); }
  }
  for (const [, id] of text[f].matchAll(/href="\/?#([\w-]+)"/g)) {
    if (!text['index.html'].includes(`id="${id}"`)) fails.push(`${f}: missing anchor #${id}`);
  }
}

// 6. No hosted font or script dependencies
for (const f of pages) if (/fonts\.googleapis|fonts\.gstatic|<script[^>]+src="https?:/.test(text[f])) fails.push(`${f}: external font/script dependency`);

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of fails) console.log(`FAIL  ${e}`);
if (fails.length) { console.log(`\n${fails.length} problem(s). Not ready to launch.`); process.exit(1); }
console.log(warns.length ? '\nChecks pass apart from placeholders (local review mode).' : '\nAll launch checks pass.');
