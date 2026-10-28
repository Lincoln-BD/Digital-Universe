"""Speed step. build.py calls make_assets() first, then writes the pages.

Needs Node tools once:  cd tools && npm install      (or set SITE_TOOLS=/path/to/node_modules)
Output (all generated — never edit by hand):
  assets/css/style.min.css   fonts + all CSS, minified
  assets/js/core.min.js      gsap + ScrollTrigger + lenis + icons + data + script + fx + chatbot + pwa
  assets/js/bg.min.js        home video background
  assets/js/space.min.js     three.js + space.js (sub-pages, loaded after the page is shown)
  assets/fonts/*.woff2       self-hosted fonts      assets/vendor/  (kept for reference)
  assets/build.json          file hashes used for ?v= cache busting
  sw.js                      service worker with the hashed file list
"""
import os, re, json, hashlib, subprocess, shutil, glob

HERE = os.path.dirname(os.path.abspath(__file__))
NM = os.environ.get('SITE_TOOLS') or os.path.join(HERE, 'tools', 'node_modules')
A = lambda *p: os.path.join(HERE, 'assets', *p)

def node(code, *args):
    return subprocess.run(['node', '-e', code, *args], check=True, capture_output=True, text=True, cwd=HERE,
                          env={**os.environ, 'NODE_PATH': NM}).stdout

def read(p): return open(p, encoding='utf-8').read()
def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(s)
def h(p): return hashlib.md5(open(p, 'rb').read()).hexdigest()[:8]

# ---------- fonts ----------
FONTS = [('sora', 'Sora', [300, 400, 500, 600, 700], ['latin']),
         ('space-grotesk', 'Space Grotesk', [500, 600, 700], ['latin']),
         ('inter', 'Inter', [400, 500, 600, 700], ['latin']),
         ('jetbrains-mono', 'JetBrains Mono', [400, 500, 600], ['latin']),
         ('amiri', 'Amiri', [400, 700], ['arabic', 'latin']),
         ('noto-sans-bengali', 'Noto Sans Bengali', [400, 600, 700], ['bengali'])]

def fonts_css():
    out = []
    os.makedirs(A('fonts'), exist_ok=True)
    for slug, fam, weights, subsets in FONTS:
        base = os.path.join(NM, '@fontsource', slug)
        for w in weights:
            for sub in subsets:
                css = os.path.join(base, f'{sub}-{w}.css')
                if not os.path.exists(css): css = os.path.join(base, f'{w}.css')
                for blk in re.findall(r'@font-face\s*\{.*?\}', read(css), re.S):
                    m = re.search(r'url\(\./files/([^)]+?\.woff2)\)', blk)
                    if not m or f'-{sub}-' not in m.group(1): continue
                    f = m.group(1)
                    shutil.copy(os.path.join(base, 'files', f), A('fonts', f))
                    um = re.search(r'unicode-range:[^;]+;', blk); ur = um.group(0) if um else ''
                    out.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-display:swap;font-weight:{w};"
                               f"src:url(../fonts/{f}) format('woff2');{ur}}}")
    return '\n'.join(sorted(set(out)))

# ---------- icons ----------
def used_icons():
    names = set()
    srcs = glob.glob(os.path.join(HERE, 'content', '*.html')) + [os.path.join(HERE, 'build_common.py')] + glob.glob(A('js', '*.js'))
    for f in srcs:
        if f.endswith(('core.min.js', 'bg.min.js', 'space.min.js', 'icons.js')): continue
        t = read(f)
        names |= set(re.findall(r'data-lucide="([a-z0-9-]+)"', t))
        names |= set(re.findall(r'icon:\s*[\'"]([a-z0-9-]+)[\'"]', t))
    names |= {'orbit', 'user', 'graduation-cap', 'briefcase', 'lightbulb', 'satellite', 'volume-2', 'volume-x', 'message-circle', 'x', 'check', 'play', 'send', 'sparkles', 'download', 'plus', 'arrow-right'}
    return sorted(names)

def icon_nodes(names):
    code = """
const L=require('lucide');const names=process.argv.slice(1);const out={};
for(const n of names){const P=n.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('');
 const ic=L.icons[P]; if(!ic){console.error('MISSING '+n);continue;}
 out[n]=ic[2].map(([t,a])=>[t,a]);}
console.log(JSON.stringify(out));"""
    return json.loads(node(code, *names))

ICON_ATTRS = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
def svg_inner(nodes):
    return ''.join('<%s %s/>' % (t, ' '.join('%s="%s"' % (k, v) for k, v in a.items() if k != 'key')) for t, a in nodes)

_ICONS = None
def inline_icons(html):
    global _ICONS
    if _ICONS is None: _ICONS = icon_nodes(used_icons())
    def rep(m):
        name, rest = m.group(1), m.group(2)
        if name not in _ICONS: return m.group(0)
        cls = re.search(r'class="([^"]*)"', rest)
        c = 'lucide lucide-%s%s' % (name, (' ' + cls.group(1)) if cls else '')
        return '<svg %s class="%s" aria-hidden="true">%s</svg>' % (ICON_ATTRS, c, svg_inner(_ICONS[name]))
    return re.sub(r'<i data-lucide="([a-z0-9-]+)"([^>]*)></i>', rep, html)

def icons_js():
    names = used_icons(); nodes = icon_nodes(names)
    data = json.dumps(nodes, separators=(',', ':'))
    return ("/* generated by optimize.py — tiny stand-in for the lucide runtime (icons are inlined at build time) */\n"
            "(function(){var I=%s;var A={xmlns:'http://www.w3.org/2000/svg',width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'};"
            "function mk(n,a){var e=document.createElementNS('http://www.w3.org/2000/svg',n);for(var k in a)e.setAttribute(k,a[k]);return e}"
            "window.lucide={icons:I,createIcons:function(){var l=document.querySelectorAll('i[data-lucide]');for(var i=0;i<l.length;i++){var el=l[i],n=el.getAttribute('data-lucide'),d=I[n];if(!d)continue;"
            "var s=mk('svg',A);s.setAttribute('class','lucide lucide-'+n+(el.className?' '+el.className:''));s.setAttribute('aria-hidden','true');"
            "for(var j=0;j<d.length;j++)s.appendChild(mk(d[j][0],d[j][1]));if(el.parentNode)el.parentNode.replaceChild(s,el)}}}})();\n") % data

# ---------- minify ----------
def terser(src):
    r = subprocess.run([os.path.join(NM, '.bin', 'terser'), '-c', '-m'], input=src, capture_output=True, text=True, check=True)
    return r.stdout
def cleancss(src):
    r = subprocess.run([os.path.join(NM, '.bin', 'cleancss'), '-O1'], input=src, capture_output=True, text=True, check=True)
    return r.stdout
def vendor(rel):
    s = read(os.path.join(NM, rel))
    return re.sub(r'//# sourceMappingURL=.*', '', s).rstrip() + '\n;\n'

def make_assets():
    # CSS
    parts = ''.join(read(os.path.join(HERE, '_css', f)) + '\n' for f in ('01-base.css', '02-components.css', '03-responsive.css'))
    write(A('css', 'style.css'), parts)
    write(A('css', 'style.min.css'), cleancss(fonts_css() + '\n' + parts))
    # vendor copies (reference only)
    os.makedirs(A('vendor'), exist_ok=True)
    # JS
    write(A('js', 'icons.js'), icons_js())
    own = ''.join(terser(read(A('js', f))) + '\n;\n' for f in ('icons.js', 'data.js', 'script.js', 'fx.js', 'chatbot.js', 'pwa.js'))
    core = (vendor('gsap/dist/gsap.min.js') + vendor('gsap/dist/ScrollTrigger.min.js') + vendor('lenis/dist/lenis.min.js') + own)
    write(A('js', 'core.min.js'), core)
    write(A('js', 'bg.min.js'), terser(read(A('js', 'bg-video.js'))))
    write(A('js', 'space.min.js'), vendor('three/build/three.min.js') + terser(read(A('js', 'space.js'))))
    # hashes
    files = ['css/style.min.css', 'js/core.min.js', 'js/bg.min.js', 'js/space.min.js']
    man = {f: h(A(*f.split('/'))) for f in files}
    man['_all'] = hashlib.md5(json.dumps(man, sort_keys=True).encode()).hexdigest()[:8]
    write(A('build.json'), json.dumps(man, indent=1))
    return man

def v(man, f): return 'assets/%s?v=%s' % (f, man[f])

def fonts_preload():
    # latin fonts used above the fold, loaded before the CSS asks for them
    want = ['sora-latin-600-normal.woff2', 'inter-latin-400-normal.woff2']
    return ''.join('<link rel="preload" href="assets/fonts/%s" as="font" type="font/woff2" crossorigin>\n' % f
                   for f in want if os.path.exists(A('fonts', f)))

SW = r"""/* Generated by optimize.py — do not edit by hand.
   HTML: network-first (always the newest page; cache only when offline).
   Files with ?v=hash: cache-first (a new hash is a new URL, so they can never be stale).
   Other same-origin files (images, fonts, icons): stale-while-revalidate.
   Cross-origin, audio and video go straight to the network. */
const CACHE_VERSION = '%(ver)s';
const STATIC_CACHE = 'digital-hub-static-' + CACHE_VERSION;
const RUNTIME_CACHE = 'digital-hub-runtime-' + CACHE_VERSION;
const PRECACHE_URLS = %(pre)s;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => Promise.all(PRECACHE_URLS.map((u) => c.add(u).catch(() => {})))));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((n) => Promise.all(n.filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

async function networkFirstHTML(req) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
    const fresh = await fetch(req, { signal: ctl.signal }); clearTimeout(t);
    if (fresh && fresh.ok) (await caches.open(RUNTIME_CACHE)).put(req, fresh.clone());
    return fresh;
  } catch (err) {
    return (await caches.match(req)) || (await caches.match('offline.html')) || Response.error();
  }
}
async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const fresh = await fetch(req);
  if (fresh && fresh.ok) (await caches.open(STATIC_CACHE)).put(req, fresh.clone());
  return fresh;
}
async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const net = fetch(req).then((f) => { if (f && f.ok) cache.put(req, f.clone()); return f; }).catch(() => null);
  return cached || (await net) || Response.error();
}
self.addEventListener('fetch', (event) => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || req.headers.has('range')) return;
  if (url.pathname.includes('/assets/audio/') || url.pathname.includes('/assets/video/')) return;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) { event.respondWith(networkFirstHTML(req)); return; }
  if (url.search.indexOf('v=') !== -1) { event.respondWith(cacheFirst(req)); return; }
  event.respondWith(staleWhileRevalidate(req));
});
"""
def write_sw(man):
    pre = ['offline.html', 'manifest.json', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
           'assets/img/grain.png', 'assets/fonts/sora-latin-600-normal.woff2', 'assets/fonts/inter-latin-400-normal.woff2']
    pre += [v(man, f) for f in ('css/style.min.css', 'js/core.min.js', 'js/bg.min.js', 'js/space.min.js')]
    write(os.path.join(HERE, 'sw.js'), SW % {'ver': 'v' + man['_all'], 'pre': json.dumps(pre)})
