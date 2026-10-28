# Shared pieces used by every page. Edit here, then run:  python3 build.py
# (Changing the menu, the footer, or the scripts here changes ALL pages at once.)

NAV_ITEMS = [
    ("Home", "index.html", "home", "orbit"),
    ("About", "about.html", "about", "user"),
    ("Journey", "journey.html", "journey", "graduation-cap"),
    ("Career", "career.html", "career", "briefcase"),
    ("Insights", "insights.html", "insights", "lightbulb"),
    ("Connect", "connect.html", "connect", "satellite"),
]

import os
_HERE = os.path.dirname(os.path.abspath(__file__))
def _fallback_css():
    css = ''
    for var, name in (('--bh-poster-pc', '_bh_poster_pc.b64'), ('--bh-poster-m', '_bh_poster_m.b64')):
        try:
            b64 = open(os.path.join(_HERE, name)).read().strip()
        except OSError:
            continue
        css += var + ':url(data:image/jpeg;base64,' + b64 + ');'
    return '<style>:root{' + css + '}</style>\n' if css else ''


SITE_URL = "https://lincoln-bd.github.io/My-Eco/"
MAN = None   # set by build.py (file hashes from optimize.py)

def _v(f):
    return 'assets/%s?v=%s' % (f, MAN[f]) if MAN else 'assets/' + f


def head(title, description, page_key='', filename='index.html'):
    import optimize
    preload = (_fallback_css()) if page_key == 'home' else ''
    url = SITE_URL + ('' if filename == 'index.html' else filename)
    img = SITE_URL + 'assets/img/og-image.jpg'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="author" content="MD. Sadman Shaharier">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MD. Sadman Shaharier">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{img}">
<meta name="theme-color" content="#010102">
<meta name="color-scheme" content="dark">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Digital Hub">
{optimize.fonts_preload()}{preload}<link rel="stylesheet" href="{_v('css/style.min.css')}">
<script>
  /* 1) html.js lets CSS hide not-yet-animated content ONLY when scripts can run.
     2) warp-arrive keeps the screen black until the arrival animation runs (page transition).
     3) failsafe: if the page script has not started after 4 s (slow or blocked network), show everything anyway. */
  (function () {{
    var d = document.documentElement;
    d.classList.add('js');
    try {{ if (sessionStorage.getItem('warp') === '1' && !matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('warp-arrive'); }} catch (e) {{}}
    setTimeout(function () {{
      if (!d.classList.contains('gs-ready')) d.classList.add('reveal-all');
      d.classList.remove('warp-arrive');
    }}, 4000);
  }})();
</script>
<noscript><style>[data-gsap]{{opacity:1!important}}html.warp-arrive body::after{{display:none}}</style></noscript>
</head>'''


def background(page_key):
    if page_key == "home":
        stage = ('<div class="bg-stage" id="bgStage" aria-hidden="true"><div class="bh-parallax"><div class="bh-frame">'
                 '<div class="bh-poster"></div>'
                 '<video class="bh-video" autoplay muted loop playsinline preload="auto" disablepictureinpicture disableremoteplayback tabindex="-1" '
                 'data-pc="assets/video/pc" data-mobile="assets/video/mobile"></video>'
                 '</div></div></div>')
    else:
        stage = '<div class="bg-stage" id="bgStage" aria-hidden="true"><canvas id="space"></canvas></div>'
    return f'''{stage}
<div class="bg-scrim" aria-hidden="true"></div>
<div class="grain-overlay" aria-hidden="true"></div>'''


def nav():
    items = "\n          ".join(
        f'<li><a href="{href}" data-page="{key}"><i data-lucide="{icon}"></i><span>{label}</span></a></li>'
        for label, href, key, icon in NAV_ITEMS
    )
    return f'''<div class="dock-wrap">
  <nav class="dock" id="nav" aria-label="Main">
    <a href="index.html" class="dock-logo" aria-label="Home"><span class="logo-core"></span><span>MS</span></a>
    <div class="dock-links-wrap">
      <ul class="dock-links" id="navLinks">
          {items}
      </ul>
      <span class="dock-beam" id="navIndicator" aria-hidden="true"></span>
    </div>
    <div class="dock-tools">
      <button class="sound-toggle" id="soundToggle" type="button" aria-pressed="false" aria-label="Play music"><i data-lucide="volume-x"></i></button>
      <button class="install-toggle" id="installToggle" type="button" aria-label="Install this site as an app" title="Install app"><i data-lucide="download"></i></button>
    </div>
    <span class="dock-laser" aria-hidden="true"></span>
  </nav>
</div>'''


def footer():
    return '''<footer class="slim-footer">
  © 2026 MD. Sadman Shaharier · <a href="connect.html">Get in touch</a>
</footer>'''


def scripts(page_key):
    core = f'<script src="{_v("js/core.min.js")}" defer></script>\n'
    if page_key == "home":
        return core + f'<script src="{_v("js/bg.min.js")}" defer></script>'
    # sub-pages: the star-field (three.js) loads AFTER the page is shown, so it never delays first paint
    return core + ('<script>addEventListener("load",function(){var s=document.createElement("script");s.src="%s";document.body.appendChild(s)})</script>' % _v("js/space.min.js"))


def page(page_key, title, description, body, filename='index.html'):
    import optimize
    return optimize.inline_icons(f'''{head(title, description, page_key, filename)}
<body data-page="{page_key}">

{background(page_key)}

{nav()}

<main id="main">
{body}
</main>

{footer()}

{scripts(page_key)}
</body>
</html>
''')
