#!/usr/bin/env bash
# Review captures via Chrome's native screenshot (reduced motion forced).
cd "$(dirname "$0")/.." || exit 1
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
R=.impeccable/review; mkdir -p "$R"
shot() { timeout 60 "$CH" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$(cygpath -w "$TEMP")\nsr-cli" --force-prefers-reduced-motion --window-size="$3" --screenshot="$(cygpath -w "$PWD/$R/$2")" "http://127.0.0.1:4180$1" >/dev/null 2>&1; echo "$2"; }
shot / desktop-fold.png 1440,900
shot / laptop-fold.png 1280,720
timeout 60 node scripts/shoot.mjs http://127.0.0.1:4180/ "$R/mobile-fold.png" 390 844 >/dev/null && echo mobile-fold.png   # phone widths need device emulation
