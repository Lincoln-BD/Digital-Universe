# MD. Sadman Shaharier — Personal Digital Ecosystem

A static website. It works on GitHub Pages with no server.

## What is new
- **Home:** your black hole video is the full-screen background (`assets/video/blackhole.mp4` + `.webm`). It loops without a visible jump, has no sound, and fades in over a poster picture.
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
- Reduced motion or Save-Data -> shows the poster picture and a **Play motion** button.
- If the video file is missing, the poster picture (built into `index.html`) is shown, so it is never black.
- Phones show the whole black hole (smaller frame with soft edges) instead of a cropped centre.
- Debug: add `?bhdebug` to the home address to see the state (`video` = playing).

### Change the video later
1. Put a new clip in `assets/video/` as `blackhole.mp4` (H.264) and `blackhole.webm` (VP9). Keep it under about 3 MB, no audio.
2. Make a first-frame `poster.jpg`, and a small base64 copy in `_bh_fallback.b64` (then run `python3 build.py`).
Tip: one command to shrink a clip: `ffmpeg -i in.mp4 -an -c:v libx264 -crf 25 -movflags +faststart blackhole.mp4`

## Add the music (important)
Hans Zimmer's "Interstellar - S.T.A.Y" is copyrighted, so it is not inside this zip.
1. Put your own legal copy here: `assets/audio/stay.mp3`
2. Keep it under about 10 MB (128 kbps is enough).
3. Upload to GitHub. The speaker button will work. Until the file exists, the button stays greyed out.
