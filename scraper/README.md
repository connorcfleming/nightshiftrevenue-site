# The Free Lead Scraper Setup (ScrapeGraphAI + Claude)

Claude Code builds and maintains the pipeline and finds new sites. ScrapeGraphAI
visits each site. Claude Haiku reads the pages. You wake up to a fresh `leads.csv`.

Not part of the website build: `scripts/build.mjs` only copies an allowlist into `dist/`.

## How the pieces fit

- **Claude Code** (`claude`) sets things up, finds new sources each morning, and fixes the script when sites change.
- **ScrapeGraphAI** visits each website and pulls out the fields in `harvest.py`.
- **Claude Haiku** (`anthropic/claude-haiku-5-5`) reads the pages. Swap in the commented-out `ollama/llama3.2` block in `harvest.py` to run free and local.
- **`leads.csv`** grows every run, and sites already in it are skipped.

> Rule of thumb: Claude Code builds the scraper, Haiku runs it.

| File | What it is |
|---|---|
| `harvest.py` | The scraper (max 50 new sites per run) |
| `run.sh` | The daily job: Claude finds sites, then `harvest.py` scrapes them |
| `ready.sh` | Turns `leads.csv` into `leads_ready.csv` with an opener per brand |
| `prompts/` | The prompts Claude runs, as plain text you can edit |
| `.env.example` | API key, category and `claude` path |

## Step 1: Install

```bash
cd scraper
cp .env.example .env      # add your Anthropic key and category
claude -p "$(cat prompts/setup.md)"
```

Or by hand:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
```

## Step 2: Get a list of sites

```bash
./run.sh
```

Claude runs `prompts/find_sites.md` with your `CATEGORY`, appends up to 50 new UK
ecommerce homepages to `sites.txt` (it skips marketplaces and anything already
seen, and normalises URLs), then `harvest.py` scrapes them. The output goes to `harvest.log`.

To scrape only, add homepages to `sites.txt` yourself, then:

```bash
source venv/bin/activate && set -a && . ./.env && set +a
python harvest.py
```

## Step 3: Every morning

`crontab -e`, then add:

```
0 7 * * * /full/path/to/scraper/run.sh
```

Your computer needs to be awake at 7am, or put this on a cheap always-on server.
Set `CLAUDE_BIN` in `.env` to the output of `which claude`, because cron doesn't
read your shell profile.

## Step 4: Turn leads into openers

```bash
./ready.sh
```

Claude drops rows with no email and no contact page, writes a 3-line opener for
each remaining brand, and saves `leads_ready.csv`.

`leads*.csv`, `harvest.log`, `.env` and `venv/` are gitignored.

## Stay on the right side of the rules

Only collect information businesses publish themselves, and respect `robots.txt`
and each site's terms. In the UK, emailing a company's generic or corporate address
is generally fine if you say who you are and offer an easy opt-out. Sole traders and
partnerships count as individuals and need consent first. Every cold email needs an
unsubscribe line.

## When it breaks

- **`playwright` errors**: run `playwright install` with the venv active.
- **Every row is null**: the site renders with JavaScript or blocks bots. Set `"headless": False` once to see what the browser gets.
- **The cron job never runs, or `site refresh failed` appears in the log**: `CLAUDE_BIN` is wrong or Claude isn't logged in. Run `./run.sh` by hand once.
- **Ollama returns broken JSON**: keep `"format": "json"` and split long field lists into two passes.
- **The same companies keep coming back**: URLs must match exactly. The find prompt normalises new URLs; fix any old ones in `sites.txt` by hand.
- **A site changed and broke the script**: in this folder, ask `claude` "harvest.py is failing on <url>, here's harvest.log. Fix it."

## Do this in the next 10 minutes

- [ ] Fill in `.env` and run the Step 1 install
- [ ] Put 5 homepages in `sites.txt` and run `python harvest.py`
- [ ] Open `leads.csv` and check which fields came back
