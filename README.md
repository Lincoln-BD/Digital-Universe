# MD. Sadman Shaharier — Personal Digital Ecosystem

A premium, multi-page personal website: career, education, and a merged Insights ecosystem (HR, AI, crypto, football, faith, entertainment) — all under one connected identity. Plain HTML/CSS/JS — no build step required to run it.

## 📁 Files

```
index.html        → Home — digital front door, quick paths, latest updates, closing CTA
about.html         → My story, values, goals
journey.html       → Education timeline
career.html        → Career timeline, skills, "Request My Resume"
insights.html      → Insights hub — 6 merged categories (Career & HR, AI & Tech,
                      Crypto & Markets, Sports-Football, My Faith, Entertainment)
football.html      → Insights spoke — Football (reached via Insights hub)
tech-ai.html       → Insights spoke — Tech, AI & Global Panorama
crypto.html        → Insights spoke — Crypto guide + live prices
movies.html        → Insights spoke — Movies & Series
deen.html          → Insights spoke — Deen & Personal Values + Deen Academy
connect.html       → Social links + contact form

assets/css/style.css → all styling (design system + every page's layout)
assets/js/script.js  → galaxy background, nav, animations, forms, all interactions
assets/js/data.js    → ⭐ EDIT THIS to add Home's "Latest Updates" — one place, no HTML needed

build.py, build_common.py → the generator used to produce these pages (optional —
  only needed if you want to regenerate pages after changing shared nav/footer/etc.
  You do NOT need Python to run or host the site; the .html files already work standalone.)
```

## 🧭 Navigation model

Top nav is flat: **Home · About · Journey · Career · Insights · Connect**.
Football, Tech & AI, Crypto, Movies, and Deen are no longer separate nav items —
they're reached through the **Insights hub** (hub-and-spoke), which merges what
used to be "Personal Universe" and "Deen" into one organized, non-repetitive
ecosystem. Every spoke page's closing CTA routes back to Insights, keeping the
site feeling like one connected journey rather than disconnected pages.

Media and Updates are no longer standalone pages — Media had no content yet and
was removed per your request; Updates now lives inside Home's "What I'm Doing
Now" section.

## 🛠 Before you publish

1. In **every page**, `data-email="hello@example.com"` (search for it) → your real email.
   Also update `OWNER_EMAIL` near the top of `initResumeRequest()` and `initContactForm()`
   in `assets/js/script.js` — that's where the resume request and contact forms send to.
2. The social link `href="#"` on `connect.html` → your real LinkedIn / Facebook / X / WhatsApp URLs.
3. Add your own Updates in `assets/js/data.js` — they show up on Home automatically.

## 🐛 Bugs fixed this round

Four confirmed root causes of the flickering / blackout / shaking / hanging:

1. **Flicker on load** — two separate animation systems were both fading in the
   same elements at the same time, racing each other. Now there's a single
   source of truth for every reveal animation.
2. **Jump/shake near the bottom of Home** — dynamically-injected content (the
   Updates cards) was being added to the page *after* the scroll-animation
   system had already measured the page height, leaving stale trigger
   positions for everything below it. Fixed by reordering initialization.
3. **Blackout flash near the bottom of pages** — a decorative scroll-velocity
   blur effect spiked right as Lenis's rubber-band bounce hit the bottom of
   the page. Removed entirely — stability over decoration.
4. **Shake after clicking into a Career card** — expanding a card changed the
   page's height without telling the scroll-animation system to recalculate.
   Now it refreshes automatically after the expand transition finishes.

Also added: `overscroll-behavior-y: none` to stop the browser's native bounce
from fighting with Lenis, and grouped scroll-triggers on every card grid
(Insights, Connect, Career skills, coin guide, values) so dense card sections
use one shared trigger instead of one per card — fewer scroll listeners,
smoother scrolling overall.

## 🚀 What's inside

- **3D galaxy background**, glassmorphism UI, and 3D nav — shared across every page
- **Per-page accent colors** — About (sky), Journey (aqua), Career (gold), Insights (pink), Connect (violet) — tag labels, glowing borders, and headings pick this up automatically
- **Premium buttons** (`.btn-elite`) with a gradient shimmer sweep on hover, used for hero CTAs, the resume request, and the contact form
- **Premium closing CTA band on Home** — "Know More" → About, "Connect With Me" → Connect
- **Request My Resume** — opens a short form; submitting drafts an email to you (front-end only for now — see the comment above `initResumeRequest()` in `script.js` for how to wire this to a real backend later)
- **Contact form** on the Connect page — same mailto-based approach, same upgrade path
- **Live crypto prices** on the Crypto page (BTC, ETH, XRP, SOL, DOGE, TAO, SUI, SEI — auto-converted to BDT)
- **Light/dark mode**, smooth scroll, kinetic typography, and `prefers-reduced-motion` support

## 📤 Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Premium restructure: merged Insights, bug fixes, visual polish"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If you're updating an existing repo instead: delete `media.html` and
`updates.html` from GitHub (they no longer exist locally), then upload
everything else the same way you did last time — remembering the `assets`
folder needs to stay nested (`assets/css/...`, `assets/js/...`), not loose
at the root.

## 🌐 Free hosting with GitHub Pages

1. Push the repo (steps above)
2. On GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)**
3. Live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## ⚙️ Tech used (via CDN, already linked in every page)

- [Three.js](https://threejs.org/) r128 — galaxy background
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll animations
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll
- [Lucide](https://lucide.dev/) — icon graphics
- Google Fonts — Space Grotesk, Inter, JetBrains Mono

## 🔒 Privacy & future upgrades

Built on the principle: **public by choice, private by default.** The Resume Request and Contact forms currently work by opening the visitor's email app (no backend needed). When you're ready for a real approval workflow, private content, or an admin panel, the code has clear comments marking exactly where to add a backend — see `initResumeRequest()` and `initContactForm()` in `assets/js/script.js`.

## ⚠️ Content note

The crypto content ends with an educational-only disclaimer — it explains concepts, not investment advice. The Deen Academy content is a concise study summary, not a substitute for a qualified teacher.

