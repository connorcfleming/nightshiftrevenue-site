#!/usr/bin/env bash
# Cron entry point: cron doesn't load your shell profile, so load the key here.
set -euo pipefail
cd "$(dirname "$0")"
[ -f .env ] && set -a && . ./.env && set +a
./venv/bin/python harvest.py >> harvest.log 2>&1
