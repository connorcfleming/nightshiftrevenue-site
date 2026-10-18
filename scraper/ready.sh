#!/usr/bin/env bash
# Turns leads.csv into leads_ready.csv with a personalised opener per brand.
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env ] && set -a && . ./.env && set +a
"${CLAUDE_BIN:-claude}" -p "$(cat prompts/ready.md)" --allowedTools "Read,Write"
