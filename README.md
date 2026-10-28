# MD. Sadman Shaharier — Personal Digital Ecosystem

A static website. It works on GitHub Pages with no server.

## What is new
- **Home:** two background videos. `assets/video/pc.*` for computers and tablets in landscape, `assets/video/mobile.*` for phones in portrait. Both loop with no jump, have no sound, and fade in over a poster picture. Only the needed one is downloaded.
- **Dock:** a glass menu with a gold laser edge and a sliding beam under the active page.
- **Cursor:** a laser crosshair that snaps onto buttons (desktop only).
- **Music:** the speaker button plays `assets/audio/stay.mp3` (OFF by default, remembers your choice, keeps playing across pages). **You must add this file yourself** (see below).
- **Page change:** a soft dark veil with a gentle fade, drift and blur. No flashy effects.
- **Fonts:** Sora (headings) and Inter (text). Clean white type, no fire or texture.
- **Other pages:** each one has its own cosmic sky (nebula, galaxy, deep space).
- **No purple:** the colours are black, molten gold, blue, silver, star-white and bright pink.

## Safe for weak devices
- Home uses a plain image, so it is very light. Other pages check WebGL first and fall back to a 2D star field.
- Pixel ratio is limited to `Math.min(devicePixelRatio, 2)` and the frame rate is capped at 60.
- Resolution drops by itself if the device is slow.

## Folders
```
index.html, about.html ...   built pages (upload these)
assets/css/style.css         all styles
assets/js/space.js           black hole + cosmic backgrounds
assets/js/fx.js              cursor, sound, dock beam, warp
assets/js/script.js          animations, forms, crypto prices
assets/js/data.js            your updates and playlists (edit here)
content/*.html               text of each page (edit here)
build.py, build_common.py    page builder
sw.js, manifest.json         offline / install support
```

## How to edit
1. Change text in `content/<page>.html` (or the menu/footer in `build_common.py`).
2. Run `python3 build.py`.
3. If you changed CSS parts in `_css/`, run:
   `cat _css/01-base.css _css/02-components.css _css/03-responsive.css > assets/css/style.css`
4. In `sw.js`, raise `CACHE_VERSION` (v5 → v6) so visitors get the new files.
5. Upload everything to GitHub. The workflow in `.github/workflows/static.yml` deploys it.

## Test tips
- `?gl=off` in the address forces the 2D fallback.
- `?gl=force` forces WebGL.

## Home video: how it stays safe
- Muted, looping, plays inline on phones. Starts on the first touch if the phone blocks autoplay.
- Phone turned sideways -> switches to the PC video by itself.
- Reduced motion or Save-Data -> shows the poster picture and a **Play motion** button (no video is downloaded).
- If a video file is missing, the poster picture (built into `index.html`) is shown, so the page is never black.
- Debug: add `?bhdebug` to the home address to see the state (`video` = playing).

### How the loops were made
- PC clip: watermark removed, slowed to half speed (smooth frame interpolation), end cross-faded into the start (6 s loop).
- Mobile clip: plays forward then backward with a smooth ease (14 s loop), so the camera "breathes" and never jumps.

### Change a video later
1. Put new files in `assets/video/`: `pc.mp4` + `pc.webm` and `mobile.mp4` + `mobile.webm` (no audio, under about 3 MB each).
2. Make first-frame pictures `pc-poster.jpg` and `mobile-poster.jpg`, and small base64 copies in `_bh_poster_pc.b64` / `_bh_poster_m.b64`. Then run `python3 build.py`.
3. Raise `CACHE_VERSION` in `sw.js`.

## Add the music (important)
Hans Zimmer's "Interstellar - S.T.A.Y" is copyrighted, so it is not inside this zip.
1. Put your own legal copy here: `assets/audio/stay.mp3`
2. Keep it under about 10 MB (128 kbps is enough).
3. Upload to GitHub. The speaker button will work. Until the file exists, the button stays greyed out.

## v9 — Speed build (read this)
Pages now load `assets/css/style.min.css`, `assets/js/core.min.js`, `bg.min.js` / `space.min.js` (all generated).
Fonts, GSAP, Lenis and icons are self-hosted — no CDN needed, so the first visit is the same as the second.
To change text: edit `content/*.html`, then run `python3 build.py` (needs `cd tools && npm install` once).
If you only edit built pages by hand, they will be overwritten on the next build.
Always upload ALL files (sw.js, assets/, every .html), then hard refresh once (Ctrl+Shift+R).
Put your music at `assets/audio/stay.mp3`.
