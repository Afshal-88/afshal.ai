"""Save the text of every starxmarketing.com page linked from the home page.

Usage: python3 site_snapshot.py <out_dir>   (one .txt per page)
"""
import re, html, sys, urllib.request, json, os
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
def get(u):
    r = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(r, timeout=30).read().decode("utf-8", "ignore")
def text(s):
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", "\n", t))
    return "\n".join(l.strip() for l in t.split("\n") if l.strip())
home = get("https://starxmarketing.com/")
paths = sorted(set(re.findall(r'href="(/[a-z0-9\-/]*)"', home)) | {"/"})
paths = [p for p in paths if not p.startswith("/_next")]
for p in paths:
    try:
        open(os.path.join(out, (p.strip("/").replace("/", "__") or "home") + ".txt"), "w").write(text(get("https://starxmarketing.com" + p)))
    except Exception as e:
        print("fail", p, e)
print(json.dumps(paths))
