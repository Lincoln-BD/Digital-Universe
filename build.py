"""Builds every page of the site.

How it works (simple):
  content/*.html   ->  the unique part of each page (edit these to change text)
  build_common.py  ->  the shared menu, background, footer and scripts
  Run:  python3 build.py   -> writes index.html, about.html, ... in this folder
"""
import json, os, re
from build_common import page

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")

for name in sorted(os.listdir(CONTENT)):
    if not name.endswith(".html"):
        continue
    raw = open(os.path.join(CONTENT, name), encoding="utf-8").read()
    m = re.match(r"\s*<!--meta (\{.*?\}) -->\s*", raw, re.S)
    if not m:
        raise SystemExit(f"{name}: missing <!--meta {{...}} --> header")
    meta = json.loads(m.group(1))
    body = raw[m.end():]
    html = page(meta["page"], meta["title"], meta["description"], body)
    with open(os.path.join(HERE, name), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", name)
