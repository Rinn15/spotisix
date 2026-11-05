#!/usr/bin/env python3
"""Apply the Sprint 4 Home changes to the existing js/recommendation.js."""
from pathlib import Path
import re
import sys

path = Path("js/recommendation.js")
if not path.exists():
    sys.exit("Run this script from the SpotiSix project root (js/recommendation.js not found).")

source = path.read_text(encoding="utf-8")
original = source

def replace_once(old, new, label):
    global source
    if old not in source:
        raise SystemExit(f"Could not find expected code for: {label}. No file was written.")
    source = source.replace(old, new, 1)

replace_once(
    "  let lastFlushAt = 0;",
    "  let lastFlushAt = 0;\n  let refreshOffset = 0;",
    "refresh state"
)

replace_once(
    "    const uniqueRanked = applyRepeatFilter(ranked);\n"
    "    return { ranked: uniqueRanked.slice(0, 8), hasHistory };",
    "    const uniqueRanked = applyRepeatFilter(ranked);\n"
    "    const rotatedRanked = uniqueRanked.length\n"
    "      ? uniqueRanked.map((_, index) => uniqueRanked[(index + refreshOffset) % uniqueRanked.length])\n"
    "      : [];\n"
    "    return { ranked: rotatedRanked.slice(0, 8), hasHistory };",
    "refresh rotation"
)

replace_once(
    "    title.textContent = 'Dành riêng cho bạn';\n"
    "    const refresh = document.createElement('button');\n"
    "    refresh.type = 'button';\n"
    "    refresh.className = 'see-all-btn';\n"
    "    refresh.textContent = 'Làm mới';\n"
    "    refresh.addEventListener('click', render);\n"
    "    heading.append(title, refresh);",
    "    title.textContent = 'Khám phá mới';\n"
    "    const badge = document.createElement('span');\n"
    "    badge.className = 'spotisix-fresh-badge';\n"
    "    badge.textContent = 'Fresh Picks';\n"
    "    const refresh = document.createElement('button');\n"
    "    refresh.type = 'button';\n"
    "    refresh.className = 'see-all-btn spotisix-refresh-btn';\n"
    "    refresh.textContent = '↻ Làm mới';\n"
    "    refresh.setAttribute('aria-label', 'Làm mới danh sách khám phá');\n"
    "    refresh.addEventListener('click', () => {\n"
    "      const count = getRecommendations().ranked.length;\n"
    "      refreshOffset = count > 1 ? (refreshOffset + 1) % count : 0;\n"
    "      render();\n"
    "    });\n"
    "    heading.append(title, badge, refresh);",
    "Fresh Picks heading and refresh"
)

replace_once(
    "      const featured = home.querySelector('.featured-section');\n"
    "      if (featured) home.insertBefore(section, featured);\n"
    "      else home.prepend(section);",
    "      const featured = home.querySelector('.featured-section');\n"
    "      if (featured) featured.insertAdjacentElement('afterend', section);\n"
    "      else home.append(section);",
    "place discovery after replay"
)

if source == original:
    sys.exit("No changes were applied.")
path.write_text(source, encoding="utf-8")
print("Updated js/recommendation.js for Sprint 4.")
