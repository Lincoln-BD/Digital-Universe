# MD. Sadman Shaharier — Personal Digital Ecosystem

A premium, multi-page personal website: career, education, and a merged Insights ecosystem (HR, AI, crypto, football, faith, entertainment) — all under one connected identity. Plain HTML/CSS/JS — no build step required to run it.

## 🆕 Latest update — real content + crypto fix

- **Career**: current role is now Recruitment Specialist at Neural Semiconductor (Staff Augmentation, onsite Uttara Dhaka, US/Canada/Japan). Previous role moved to Past.
- **Journey**: Master's status updated honestly — a German visa rejection paused the Chemnitz plan; framed as "Reapplying," not "In Progress."
- **About**: rewritten with the real job, faith-first framing, and values that reflect what was actually said (dropped a "Discipline" chip that didn't match — added Mutual Growth, Teamwork, Personal Space, Passion & Dedication instead), plus a new "How I Think" section on tactics/patterns across football, markets, and life.
- **Football**: added the FC Bayern München Fans Bangladesh detail (first Bayern-recognized fan club in Bangladesh), Bundesliga + German national team support, cricket/badminton.
- **Deen**: Islamic Views rewritten to state the actual creed — Tawhid, Aqidah Tahawiyya, understanding of the Qur'an/Sunnah per the Salaf.
- **Connect**: real LinkedIn, Facebook, and X links are live. Email is the real inbox now, on the page and in the mailto-based forms.
- **WhatsApp is still a placeholder** — `wa.me` links need an actual phone number with country code, not a username. Search `8801XXXXXXXXX` in `connect.html` and swap in the real number to activate it.
- **Crypto live prices — actually fixed.** The table markup existed before, but no JavaScript was ever written to populate it. Added a real fetch (CoinGecko for prices, a free exchange-rate API for USD→BDT), with error handling, a manual refresh button, and auto-refresh every 5 minutes.

## 🆕 Latest update — certifications, market accuracy, football rework

- **Journey**: added the real Goethe-Zertifikat A1 (Start Deutsch 1) exam details — Goethe-Institut, passed 19 April 2026 in Dhaka.
- **Career**: new "Certifications & Training" section with your Emotional Intelligence (Coursera/Michigan), Function of HR Department (ENSDI), and Digital Marketing (Creative IT Institute) credentials.
- **Career market accuracy fixed**: your current role at Neural Semiconductor is now correctly shown as US-market-only, IT-focused. The Canada/Japan recruiting experience moved to where it actually happened — your time at Steadfast International Services. Updated everywhere this was mentioned (Home, About, Career, Insights).
- **Insights hub**: removed the "Career & HR" card since it duplicated the dedicated Career page — now 5 categories instead of 6.
- **Connect**: WhatsApp now links to your real number.
- **Football — reworked**: replaced the basic "Formations/Pressing/xG" explainer with a proper Philosophies & Tactics glossary (Positional Play, Gegenpressing, Catenaccio, Total Football, Counter-Attacking, Direct Play) plus a Core Principles list. Added a "The Germany Connection" personal story (2006 World Cup origin, Löw's golden era, current admiration for Kompany and Guardiola).
- **Home**: added your profile photo — a circular frame with a rotating gradient ring, glow halo, and gentle float animation, sitting above your name.

## 🆕 Latest update — Deen page rebuilt as a reasoned journey

- Replaced the old "Islamic Views" + "Deen Academy" content entirely with a 9-step, click-to-expand logical journey: from the existence of God, through monotheism, the need for revelation, examining world religions and scriptures, the Abrahamic tradition, the Qur'an, the Prophet Muhammad ﷺ, and arriving at Islam.
- Each step is collapsed by default (except Step 1, which opens automatically so visitors immediately see how it works) — click any step to expand its full reasoning, evidence categories, and a "Destination" takeaway.
- Reused the same expandable-card mechanic already proven on the Career page, so it inherits the same bug fixes (no shake/jump when expanding).
- Added a capstone "Where the Chain Leads" visual at the bottom — a vertical chain from One God → One Message → Many Prophets → the Qur'an → Muhammad ﷺ → Islam.
- Increased the expand-panel's max-height ceiling (was tuned for short career bullets; this content is longer) so nothing gets clipped.

## 🆕 Latest update — Deen page expanded into a two-group journey

- **Group One — The Search for Truth**: the same 9-step reasoning journey as before, but enriched with the fuller philosophical detail you specified (the Contingency Argument, Necessary Being, infinite regress for Step 1; the specific questions about an uncreated Creator for Step 2), with every "Destination" line matching your exact wording. Sequence, logic, and destinations are unchanged.
- **The Central Bridge**: a new standalone, visually distinct section between the two groups — the Shahadah in proper Arabic script (using the Amiri typeface, added specifically for correct Arabic rendering), with transliteration and translation, framing the shift from "Is Islam true?" to "How should I live?"
- **Group Two — Understanding & Living Islam** (entirely new): a Shahadah foundation breakdown (its two testimonies explained side by side), then Arkan al-Iman (the Six Pillars of Faith) and Arkan al-Islam (the Five Pillars of Islam) as flip-cards — click or tap each to reveal its explanation.
- **Visual distinction between the groups**: Group One's timeline stays in the site's cool investigative blue; Group Two's pillar cards and dividers use warm gold, with the Arabic Shahadah bridge marking the turn between them.
- **Extended journey map** at the end, now showing the full chain across both groups plus the Shahadah bridge in the middle.
- Bumped a hidden height limit on the expandable-card component (it was tuned for shorter content) so nothing gets clipped.

## 🆕 Latest update — Deen video library + BTC trader signal watch

### Deen & Faith Media Library ("Watch · Learn · Reflect")
Added to the bottom of the Deen page, above the journey map:
- Four curated YouTube playlists (Origins & Creation, Evolution and Islam, the Bangla-language Aqidah Series, and the O Messenger AI-visualized series), rendered as clickable cards
- **One single embedded player** — clicking a card swaps the player's playlist instantly. It does *not* load four YouTube embeds at once (that would be slow); only the active one is ever in the DOM.
- Uses `youtube-nocookie.com` embeds (YouTube's privacy-enhanced mode) with `autoplay=0`, so nothing plays until a visitor chooses something.
- The Bangla title (আকিদা সিরিজ) renders in Noto Sans Bengali — a font added specifically for this, since none of the existing fonts support Bengali script.
- Playlists live in `assets/js/data.js` as `DEEN_PLAYLISTS` — add a new object there (with a YouTube playlist ID) and it appears automatically, no HTML editing needed.

### BTC Daily Analysis ("Trader Signal Watch") — Crypto page
Two cards showing the latest relevant BTC analysis from @LennaertSnyder and @TedPillows.

**Important — read this part.** X (Twitter) does not allow free, reliable automated access to posts from a static GitHub Pages site — there's no backend here to poll an API from, and X blocks most client-side scraping. Building a fake "auto-updating" feed would mean either it silently breaks or it shows made-up numbers, which is worse than not having the feature. So this is a **manually-curated snapshot**, not a live feed — exactly the "lightweight data structure" you suggested as the fallback.

I seeded it with two real, dated, sourced posts I found:
- **Lennaert Snyder** — a scalp-long setup near $81K, from 28 August 2026 (via CryptoNews)
- **Ted** — a caution about elevated open interest/leverage, from 15 August 2026 (via CryptoPotato) — this is the most recent *relevant* post of his I could verify; nothing more recent turned up

Every field that wasn't explicitly stated in the source shows "Not specified" — nothing here is guessed. **To keep this current, you'll need to check both accounts yourself periodically and edit `BTC_ANALYSIS_DATA` in `assets/js/data.js`** — there's a comment right above it explaining exactly what to do. This is a manual-refresh feature by necessity, not a bug.

### Also fixed while in here
Found and fixed a real, pre-existing bug: the `.disclaimer` text style (used on the Crypto page) was scoped to only work inside `.modal-body`, a wrapper that no longer exists since the multi-page rebuild — meaning it's been rendering completely unstyled. Fixed to work standalone.

## 🆕 Latest update — YouTube fix + BTC section simplified

### Fixed: "Error 153" on the Deen video player
The playlists were embedding via `youtube-nocookie.com`, which was throwing an embed-permission error ("Error 153") for these specific playlists. Switched to the standard `youtube.com/embed` domain — the same one YouTube's own "Share → Embed" button generates — along with the exact `allow`/`referrerpolicy` attributes YouTube currently recommends. Also added a permanent **"Open on YouTube"** link next to "Now Playing," so if a specific playlist's owner has embedding restricted in a way I have no control over, visitors always have a guaranteed-working path to watch it.

### Simplified: BTC Daily Analysis → Trader Signal Watch
Replaced the structured Outlook/Direction/Entry/TP/SL card system with three simple resource links, per your request:
- **Lennaert Snyder** (@LennaertSnyder) → links to his X profile
- **Ted** (@TedPillows) → links to his X profile
- **Growing Bulls — Pump Intelligence** → links to the scanner tool

Each just says to check there directly for the latest signals, rather than trying to keep a manually-curated snapshot current (which, as discussed, a static site can't do automatically). This is simpler to maintain — there's no data file to update anymore, since it's just three permanent links. The `BTC_ANALYSIS_DATA` structure and its render function have been removed entirely.

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

