# nightshiftrevenue.com

Night Shift Revenue's site: a homepage with an industry demo launcher, plus a 4-step database reactivation demo for each industry (`demo.html?n=medspa|dental|hvac|roofing|mortgage|realestate|plumbing`). Plain HTML/CSS/JS, no framework.

| File | What it is |
|---|---|
| `index.html` | Homepage: pitch, industry launcher, how it works, the deal, fit checklist |
| `demo.html` | The demo funnel: owner's numbers → play the lead (SMS chat) → next-morning booking → the 2,000-lead test |
| `assets/niches.js` | Every industry's copy, sample business, chat script and calculator defaults. Edit wording here. |
| `assets/demo.js` | Calculator, chat engine (offline script + optional live AI), Personalize drawer |
| `privacy.html`, `terms.html` | Placeholder legal pages. Items marked [VERIFY] need an attorney before texting campaigns launch. |
| `netlify.toml` | Publishes `dist/` built by `scripts/build.mjs`; redirects `/demos`, `/demo`, `/privacy`, `/terms` |

## Run locally

```
node scripts/serve.mjs            # http://127.0.0.1:4180/
node scripts/build.mjs            # writes dist/
```

## Deploy

Pushing to `main` on GitHub deploys to Netlify (project `nightshiftrevenue`) once the repo is linked in Netlify.

## Live AI in the demo

The chat runs offline by default. In a demo, **Personalize** accepts an OpenAI key (`sk-…`, model editable, default `gpt-4o-mini`) or an Anthropic key (`sk-ant-…`, Claude Opus 5.5). Keys are stored only in that browser's localStorage and never in links or this repo.

## Main line

404-276-6462 is a personal number for now. When the A2P 10DLC number is issued, replace it in `assets/niches.js`, `index.html`, `privacy.html` and `terms.html`.

The previous site (Oct 12–13 version) is preserved in commit `7051f66`.
