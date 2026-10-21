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
    try:
        b64 = open(os.path.join(_HERE, '_bh_fallback.b64')).read().strip()
    except OSError:
        return ''
    return '<style>:root{--bh-poster:url(data:image/jpeg;base64,' + b64 + ')}</style>\n'


def head(title, description, page_key=''):
    preload = (_fallback_css()) if page_key == 'home' else ''
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#010102">
<meta name="color-scheme" content="dark">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Digital Hub">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Amiri:wght@400;700&family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
{preload}<link rel="stylesheet" href="assets/css/style.css">
<script>
  /* if the visitor came through the warp transition, keep the screen black until the arrival animation runs */
  try {{ if (sessionStorage.getItem('warp') === '1' && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('warp-arrive'); }} catch (e) {{}}
</script>
<noscript><style>[data-gsap]{{opacity:1!important}}html.warp-arrive body::after{{display:none}}</style></noscript>
</head>'''


def background(page_key):
    if page_key == "home":
        stage = ('<div class="bg-stage" id="bgStage" aria-hidden="true"><div class="bh-parallax"><div class="bh-frame">'
                 '<div class="bh-poster"></div>'
                 '<video class="bh-video" autoplay muted loop playsinline preload="auto" poster="assets/video/poster.jpg" disablepictureinpicture disableremoteplayback tabindex="-1">'
                 '<source src="assets/video/blackhole.webm" type="video/webm; codecs=vp9">'
                 '<source src="assets/video/blackhole.mp4" type="video/mp4">'
                 '</video></div></div></div>')
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
    three = '' if page_key == "home" else '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
    bg = '<script src="assets/js/bg-video.js"></script>\n' if page_key == "home" else '<script src="assets/js/space.js"></script>\n'
    return three + '''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js"></script>
<script src="assets/js/data.js"></script>
<script src="assets/js/script.js"></script>
<script src="assets/js/fx.js"></script>
''' + bg + '''<script src="assets/js/chatbot.js"></script>
<script src="assets/js/pwa.js"></script>'''


def page(page_key, title, description, body):
    return f'''{head(title, description, page_key)}
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
'''
