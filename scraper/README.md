# Lead scraper (ScrapeGraphAI + Claude Haiku)

Visits each homepage in `sites.txt`, pulls out public contact fields with
ScrapeGraphAI, and appends them to `leads.csv`. Claude Haiku
(`anthropic/claude-haiku-5-5`) reads the pages. To run it for free, switch the
`llm` block in `harvest.py` to the commented-out Ollama option.

Not part of the website build: `scripts/build.mjs` only copies an allowlist into `dist/`.

## Setup

```bash
cd scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
cp .env.example .env   # then paste your Anthropic API key
```

## Run

Add homepages to `sites.txt`, one per line, then:

```bash
source venv/bin/activate
set -a && . ./.env && set +a
python harvest.py
```

Each run handles at most 50 new sites and skips any site already in `leads.csv`.
`leads.csv`, `harvest.log`, `.env` and `venv/` are gitignored.

## Every morning (cron)

`crontab -e`, then add this line with the real path:

```
0 7 * * * /full/path/to/scraper/run.sh
```

`run.sh` loads `.env` (cron doesn't read your shell profile) and writes output to `harvest.log`.
To also top up `sites.txt` automatically, add a step to `run.sh` before the
`python` line, for example a `claude -p "..."` call.

## Troubleshooting

- **Playwright errors**: run `playwright install` with the venv active.
- **Every field is null**: the site renders with JavaScript or blocks bots. Set `"headless": False` once to see what the browser gets.
- **The same company keeps coming back**: URLs must match exactly, so `https://brand.com` and `https://www.brand.com/` count as two different sites.

## Rules

Only collect what businesses publish themselves, and respect `robots.txt` and each site's terms.
Under UK rules (PECR), corporate addresses are generally fine to email if you
say who you are and give an easy opt-out. Sole traders and partnerships count
as individuals and need consent first.
