#!/usr/bin/env bash
# Cron entry point: Claude finds fresh sites, then Haiku scrapes them.
# Cron doesn't load your shell profile, so settings come from .env.
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env ] && set -a && . ./.env && set +a
: "${CATEGORY:?set CATEGORY in .env}"
CLAUDE="${CLAUDE_BIN:-claude}"

echo "=== $(date) ===" >> harvest.log
prompt=$(sed "s|{{CATEGORY}}|$CATEGORY|g" prompts/find_sites.md)
# If the site refresh fails, still scrape whatever is already queued.
"$CLAUDE" -p "$prompt" --allowedTools "WebSearch,WebFetch,Read,Edit,Write" >> harvest.log 2>&1 \
  || echo "site refresh failed" >> harvest.log
./venv/bin/python harvest.py >> harvest.log 2>&1
