#!/usr/bin/env bash
# Downloads itch.io page images listed in portfolio-research.json into images/.
# Skips files that already exist, so curated assets are never overwritten.
set -euo pipefail
cd "$(dirname "$0")/.."
fetch() { [ -e "$2" ] && { echo "skip $2"; return; }; curl -fsSL "$1" -o "$2" && echo "saved $2"; }
fetch "https://img.itch.zone/aW1nLzI3NDU0ODY5LnBuZw==/original/jGq%2FFi.png" "images/chaloyaar-itch-cover.png"
fetch "https://img.itch.zone/aW1nLzI3NDU1NDA1LnBuZw==/original/audd0q.png" "images/chaloyaar-itch-logo.png"
fetch "https://img.itch.zone/aW1nLzI3NDU1NTcxLnBuZw==/original/IWoDLT.png" "images/chaloyaar-itch-background.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTMwMS5wbmc=/original/11wuPA.png" "images/chaloyaar-screenshot-01.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTMwMi5wbmc=/original/mKGdm8.png" "images/chaloyaar-screenshot-02.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTI5OC5wbmc=/original/uF%2F3WS.png" "images/chaloyaar-screenshot-03.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTMwMC5wbmc=/original/US7U0W.png" "images/chaloyaar-screenshot-04.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTMwMy5wbmc=/original/xMCqSk.png" "images/chaloyaar-screenshot-05.png"
fetch "https://img.itch.zone/aW1hZ2UvNDYwODMzMy8yNzQ1NTI5OS5wbmc=/original/oTI28P.png" "images/chaloyaar-screenshot-06.png"
fetch "https://img.itch.zone/aW1nLzIzNDI5NzM0LmpwZw==/original/GKIpSz.jpg" "images/slenderar-itch-cover.jpg"
fetch "https://img.itch.zone/aW1nLzIzNDI5ODA3LmpwZw==/original/dQbi7f.jpg" "images/slenderar-itch-background.jpg"
fetch "https://img.itch.zone/aW1hZ2UvMzkyOTExOC8yMzQyOTcwMS5wbmc=/original/6jM4m7.png" "images/slenderar-screenshot-01.png"
fetch "https://img.itch.zone/aW1hZ2UvMzkyOTExOC8yMzQyOTcwMC5wbmc=/original/ofnb9r.png" "images/slenderar-screenshot-02.png"
fetch "https://img.itch.zone/aW1hZ2UvMzkyOTExOC8yMzQyOTcwMy5wbmc=/original/wJ%2FMT2.png" "images/slenderar-screenshot-03.png"
fetch "https://img.itch.zone/aW1hZ2UvMzkyOTExOC8yMzQyOTcwMi5wbmc=/original/zHNmYI.png" "images/slenderar-screenshot-04.png"
fetch "https://img.itch.zone/aW1hZ2UvMzkyOTExOC8yMzQyOTY5OS5wbmc=/original/0XKeTy.png" "images/slenderar-screenshot-05.png"
