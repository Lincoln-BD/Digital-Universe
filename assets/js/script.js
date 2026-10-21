/* =========================================================
   SITE SCRIPT — MD. Sadman Shaharier
   (cursor, sound, dock, warp transition live in fx.js;
    the black-hole background lives in space.js)
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasHover = window.matchMedia('(hover: hover)').matches;
const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
let lenisInstance = null;
/* =========================================================
   3. SMOOTH SCROLL — single driver, snappier feel
   ========================================================= */
function initSmoothScroll() {
  if (reduceMotion || typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    // Let native scrolling happen normally inside the article modal
    // (fixes: mouse wheel not scrolling the "Read More" popup)
    prevent: (node) => !!(node && node.closest && node.closest('.modal-panel'))
  });
  lenisInstance = lenis;

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
  } else {
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // NOTE: an earlier "ambient motion blur" effect (blurring the page based on
  // scroll velocity) was removed. It compounded with the many backdrop-filter
  // blurred glass cards and produced a visible flash/blackout, especially at
  // the bottom of pages where Lenis's rubber-band deceleration spikes velocity.
  // Stability > decorative motion blur.

  return lenis;
}

/* =========================================================
   4. GSAP SCROLL STORYTELLING
   ========================================================= */
const CARD_PERSPECTIVE = 1000;
const CARD3D_SELECTOR = '.hub-card, .insight-card, .skill-cat, .connect-card, .playlist-card, .coin-card, .value-chip, .update-item';

function initScrollAnimations() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-gsap]').forEach(el => el.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {
    document.querySelectorAll('[data-gsap]').forEach(el => gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 }));
    return;
  }

  const variants = {
    fade:  { from: { opacity: 0, y: 10 },  to: { opacity: 1, y: 0 } },
    up:    { from: { opacity: 0, y: 40 },  to: { opacity: 1, y: 0 } },
    left:  { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0 } },
    right: { from: { opacity: 0, x: 50 },  to: { opacity: 1, x: 0 } },
    scale: { from: { opacity: 0, scale: 0.85, y: 20 }, to: { opacity: 1, scale: 1, y: 0 } },
    // Depth-aware entrance for cards: they fold up out of the page in 3D.
    card3d: {
      from: { opacity: 0, y: 44, scale: 0.94, rotationX: 24, transformPerspective: CARD_PERSPECTIVE, transformOrigin: '50% 100%' },
      to:   { opacity: 1, y: 0, scale: 1, rotationX: 0 }
    }
  };
  function pickVariant(el, type, fallback) {
    if (type === 'scale' && el.matches(CARD3D_SELECTOR) && !el.classList.contains('flip-card')) return variants.card3d;
    return variants[type] || variants[fallback];
  }

  // Grouped cards (grids of 4-8 items) share ONE ScrollTrigger with a stagger,
  // instead of one ScrollTrigger per card. Fewer scroll listeners = smoother
  // scrolling on card-dense pages (Insights, Connect, Career skills, etc).
  document.querySelectorAll('[data-gsap-group]').forEach((group) => {
    const items = Array.from(group.querySelectorAll('[data-gsap]'));
    if (!items.length) return;
    const type = items[0].getAttribute('data-gsap') || 'scale';
    const v = pickVariant(items[0], type, 'scale');
    gsap.fromTo(items, v.from, {
      ...v.to,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 88%', toggleActions: 'play none none reverse' }
    });
    items.forEach(el => el.setAttribute('data-gsap-grouped', 'true'));
  });

  document.querySelectorAll('[data-gsap]:not([data-gsap-grouped])').forEach((el) => {
    const type = el.getAttribute('data-gsap') || 'fade';
    const v = pickVariant(el, type, 'fade');
    gsap.fromTo(el, v.from, {
      ...v.to,
      duration: 0.9,
      ease: 'power3.out',
      delay: parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0,
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    });
  });
}

/* =========================================================
   3D CARD TILT — cards lean toward the pointer with depth and a
   moving glare. GSAP owns each card's transform (so this composes
   with the entrance animation instead of fighting it); the glare
   is just a CSS variable-driven gradient. Mouse/pen devices only.
   ========================================================= */
function initCardTilt3D() {
  if (reduceMotion || !hasHover || typeof gsap === 'undefined' || typeof gsap.quickTo !== 'function') return;

  document.querySelectorAll(CARD3D_SELECTOR + ', .about-block, .home-question').forEach((card) => {
    if (card.classList.contains('flip-card') || card.classList.contains('tilt-3d')) return;
    card.classList.add('tilt-3d');
    const glare = document.createElement('span');
    glare.className = 'tilt-glare';
    glare.setAttribute('aria-hidden', 'true');
    card.appendChild(glare);

    gsap.set(card, { transformPerspective: CARD_PERSPECTIVE });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power3.out' });
    const tz = gsap.quickTo(card, 'z',         { duration: 0.55, ease: 'power3.out' });

    let rect = null;
    const MAX = 7; // degrees — enough to feel 3D, never enough to hurt readability
    const refresh = () => { rect = null; };

    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      window.addEventListener('scroll', refresh, { passive: true });
      tz(22);
    });
    card.addEventListener('pointermove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      ry((x - 0.5) * 2 * MAX);
      rx((0.5 - y) * 2 * MAX);
      card.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      window.removeEventListener('scroll', refresh);
      rect = null;
      rx(0); ry(0); tz(0);
    });
  });
}
/* =========================================================
   5. KINETIC TYPOGRAPHY — headings rise letter by letter
   ========================================================= */
function splitIntoLetters(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span');
    w.className = 'word-wrap';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch;
      w.appendChild(s);
    });
    el.appendChild(w);
    if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.classList.add('split');
  return el.querySelectorAll('.letter');
}
function initKineticTypography() {
  document.querySelectorAll('#heroName, .kinetic-heading').forEach((el) => {
    const letters = splitIntoLetters(el);
    if (reduceMotion || typeof gsap === 'undefined') return;
    const isHero = el.id === 'heroName';
    const vars = { opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: 'power3.out', stagger: 0.035 };
    gsap.set(letters, { opacity: 0, y: 34, rotationX: -70, transformOrigin: '50% 100%' });
    if (isHero) gsap.to(letters, { ...vars, delay: 0.5 });
    else gsap.to(letters, { ...vars, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/* =========================================================
   7. EXPANDABLE ORBIT CARDS (experience)
   ========================================================= */
function initExpandableCards() {
  document.querySelectorAll('[data-expand]').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('expanded');
      document.querySelectorAll('[data-expand]').forEach(c => c.classList.remove('expanded'));
      if (!isOpen) card.classList.add('expanded');
      // The card's height just changed, which shifts every element below it.
      // Without this, ScrollTrigger keeps using stale start/end positions for
      // everything further down the page — the exact cause of the "shake /
      // jump / hang" reported after clicking into a card.
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 420);
      }
    });
  });
}

/* =========================================================
   10. COPY EMAIL
   ========================================================= */
function initEmailCopy() {
  const emailCopy = document.getElementById('emailCopy');
  const copyHint = document.getElementById('copyHint');
  if (!emailCopy) return;
  emailCopy.addEventListener('click', async () => {
    const email = emailCopy.getAttribute('data-email');
    try {
      await navigator.clipboard.writeText(email);
      copyHint.textContent = 'Copied ✓';
    } catch {
      copyHint.textContent = 'Copy failed — select manually';
    }
    setTimeout(() => { copyHint.textContent = 'Click to copy'; }, 2000);
  });
}
/* =========================================================
   13. MAGNETIC BUTTONS
   ========================================================= */
function initMagneticButtons() {
  if (reduceMotion || !hasHover) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    let ticking = false, lastEvent = null;
    btn.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = btn.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left - rect.width / 2;
        const y = lastEvent.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        ticking = false;
      });
    }, { passive: true });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}
function initCryptoPrices() {
  const grid = document.getElementById('cryptoLiveGrid');
  if (!grid) return; // only present on crypto.html

  const statusEl = document.getElementById('cryptoStatus');
  const refreshBtn = document.getElementById('cryptoRefreshBtn');

  const COINS = [
    { id: 'bitcoin',       symbol: 'BTC',  name: 'Bitcoin' },
    { id: 'ethereum',      symbol: 'ETH',  name: 'Ethereum' },
    { id: 'ripple',        symbol: 'XRP',  name: 'XRP' },
    { id: 'solana',        symbol: 'SOL',  name: 'Solana' },
    { id: 'dogecoin',      symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'bittensor',     symbol: 'TAO',  name: 'Bittensor' },
    { id: 'sui',           symbol: 'SUI',  name: 'Sui' },
    { id: 'sei-network',   symbol: 'SEI',  name: 'Sei' }
  ];
  const FALLBACK_BDT_RATE = 122; // used only if the live exchange-rate fetch fails

  function fmtBDT(n) {
    if (n >= 1000) return '৳' + Math.round(n).toLocaleString('en-US');
    return '৳' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  function fmtUSDCompact(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  async function fetchRate() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.rates && data.rates.BDT) return data.rates.BDT;
    } catch (e) { /* fall through to fallback */ }
    return FALLBACK_BDT_RATE;
  }

  async function fetchPrices() {
    const ids = COINS.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('CoinGecko request failed: ' + res.status);
    return res.json();
  }

  async function loadPrices(isManualRefresh) {
    if (statusEl) statusEl.textContent = isManualRefresh ? 'Refreshing…' : 'Loading…';
    if (refreshBtn) refreshBtn.disabled = true;

    try {
      const [prices, bdtRate] = await Promise.all([fetchPrices(), fetchRate()]);

      const rows = COINS.map(coin => {
        const d = prices[coin.id];
        if (!d || typeof d.usd !== 'number') {
          return `<tr><td class="coin-cell"><span class="coin-symbol">${coin.symbol}</span>${coin.name}</td><td colspan="3" style="color:var(--frost-dim);">unavailable</td></tr>`;
        }
        const priceBdt = fmtBDT(d.usd * bdtRate);
        const cap = typeof d.usd_market_cap === 'number' ? fmtUSDCompact(d.usd_market_cap) : '—';
        const change = typeof d.usd_24h_change === 'number' ? d.usd_24h_change : null;
        const changeClass = change === null ? '' : (change >= 0 ? 'style="color:var(--aqua);"' : 'style="color:var(--pink);"');
        const changeText = change === null ? '—' : `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
        return `<tr>
          <td class="coin-cell"><span class="coin-symbol">${coin.symbol}</span>${coin.name}</td>
          <td>${priceBdt}</td>
          <td>${cap}</td>
          <td ${changeClass}>${changeText}</td>
        </tr>`;
      }).join('');

      grid.innerHTML = rows;
      if (statusEl) {
        const now = new Date();
        statusEl.textContent = `Updated ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · 1 USD ≈ ৳${bdtRate.toFixed(2)}`;
      }
    } catch (err) {
      grid.innerHTML = `<tr><td colspan="4" class="crypto-loading">Live prices are temporarily unavailable. <button id="cryptoRetryInline" style="background:none;border:none;color:var(--blue);text-decoration:underline;cursor:pointer;font-family:inherit;">Try again</button></td></tr>`;
      if (statusEl) statusEl.textContent = 'Could not reach the price feed.';
      const retryBtn = document.getElementById('cryptoRetryInline');
      if (retryBtn) retryBtn.addEventListener('click', () => loadPrices(true));
    } finally {
      if (refreshBtn) refreshBtn.disabled = false;
    }
  }

  loadPrices(false);
  if (refreshBtn) refreshBtn.addEventListener('click', () => loadPrices(true));
  // Auto-refresh every 5 minutes, matching the "Auto-refreshes every 5 minutes" note on the page
  setInterval(() => loadPrices(false), 5 * 60 * 1000);
}


/* =========================================================
   17. RESUME REQUEST (front-end only for now)
   NOTE FOR FUTURE UPGRADE: this currently opens the visitor's
   email client with a pre-filled message via a mailto: link.
   To turn this into a real "approve / deny" system later:
     1. Swap the form's submit handler below for a fetch() call
        to a backend endpoint (e.g. a small Node/Supabase function).
     2. Store each request (name, email, reason, date, status).
     3. Build a private admin view where you approve/deny and the
        approved requester gets a real download link or email.
   ========================================================= */
function initResumeRequest() {
  const openBtn = document.getElementById('resumeRequestBtn');
  const overlay = document.getElementById('resumeModalOverlay');
  if (!openBtn || !overlay) return;
  const closeBtn = document.getElementById('resumeModalClose');
  const form = document.getElementById('resumeRequestForm');
  const status = document.getElementById('resumeRequestStatus');
  const OWNER_EMAIL = 'sadmanshaharier96@gmail.com';

  function open() { overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#reqName').value.trim();
    const email = form.querySelector('#reqEmail').value.trim();
    const reason = form.querySelector('#reqReason').value.trim();
    if (!name || !email) return;

    const subject = encodeURIComponent(`Resume request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nReason: ${reason || '(not provided)'}\n\n— Sent from the "Request My Resume" form`);
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;

    status.textContent = 'Opening your email app to send the request…';
    status.classList.add('visible');
    setTimeout(() => { close(); form.reset(); status.classList.remove('visible'); }, 2500);
  });
}

/* =========================================================
   18. CONTACT FORM (mailto-based — same upgrade note as above)
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('contactFormStatus');
  const OWNER_EMAIL = 'sadmanshaharier96@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#cName').value.trim();
    const email = form.querySelector('#cEmail').value.trim();
    const message = form.querySelector('#cMessage').value.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = 'Opening your email app…';
      status.classList.add('visible');
      setTimeout(() => status.classList.remove('visible'), 3000);
    }
    form.reset();
  });
}

/* =========================================================
   19. DATA-DRIVEN RENDERERS
   Reads from assets/js/data.js (UPDATES_DATA) so content can be
   added in ONE place without touching HTML.
   ========================================================= */
function updateCard(u) {
  return `<article class="update-item glass" data-gsap="up">
    <div class="update-meta"><span class="update-date">${u.date}</span><span class="update-tag">${u.tag}</span></div>
    <h3>${u.title}</h3>
    <p>${u.description}</p>
  </article>`;
}

function renderLatestUpdates() {
  const el = document.getElementById('latestUpdates');
  if (!el || typeof UPDATES_DATA === 'undefined') return;
  el.innerHTML = UPDATES_DATA.map(updateCard).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  // This injects new DOM content AFTER initScrollAnimations() already measured
  // the page. Without a refresh, ScrollTrigger keeps stale positions for
  // everything below — the main cause of the reported jump/shake/hang near
  // the bottom of the Home page.
  if (typeof ScrollTrigger !== 'undefined') {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}

/* =========================================================
   20. DEEN — WATCH · LEARN · REFLECT (YouTube playlist library)
   Renders playlist cards from DEEN_PLAYLISTS and drives a single
   shared <iframe> — only one playlist is ever loaded at a time,
   switched by updating the iframe's src on click. No API key,
   no backend, works on GitHub Pages.
   ========================================================= */
function initDeenPlaylists() {
  const cardsEl = document.getElementById('playlistCards');
  const playerEl = document.getElementById('deenPlayer');
  const nowPlayingEl = document.getElementById('nowPlayingTitle');
  const openLinkEl = document.getElementById('openOnYoutube');
  if (!cardsEl || !playerEl || typeof DEEN_PLAYLISTS === 'undefined') return;

  function cardHtml(p, index) {
    const titleClass = p.bangla ? 'bangla-text' : '';
    return `<button class="playlist-card${index === 0 ? ' active' : ''}" data-index="${index}" data-gsap="scale"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
        aria-label="Watch ${p.title.replace(/"/g, '&quot;')}">
      <div class="playlist-card-head">
        <span class="playlist-card-icon"><i data-lucide="${p.icon}"></i></span>
        <span class="playlist-card-cat">${p.category}</span>
      </div>
      <h4 class="${titleClass}">${p.title}</h4>
      <p>${p.description}</p>
      <span class="playlist-card-cta">Watch / Explore <i data-lucide="play"></i></span>
    </button>`;
  }

  function loadPlaylist(index) {
    const p = DEEN_PLAYLISTS[index];
    if (!p) return;
    // NOTE: youtube-nocookie.com was tried first but threw "Error 153"
    // (an embed-permission check) for these specific playlists. The
    // standard youtube.com/embed domain — the one YouTube's own "Share >
    // Embed" button generates — is the most broadly compatible option.
    playerEl.src = `https://www.youtube.com/embed/videoseries?list=${p.playlistId}&autoplay=0&rel=0`;
    playerEl.title = p.title;
    if (nowPlayingEl) nowPlayingEl.textContent = p.title;
    if (openLinkEl) openLinkEl.href = `https://www.youtube.com/playlist?list=${p.playlistId}`;
    cardsEl.querySelectorAll('.playlist-card').forEach((c, i) => {
      const isActive = i === index;
      c.classList.toggle('active', isActive);
      c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  cardsEl.innerHTML = DEEN_PLAYLISTS.map(cardHtml).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  loadPlaylist(0); // first playlist featured by default, muted/paused (autoplay=0)

  cardsEl.addEventListener('click', (e) => {
    const card = e.target.closest('.playlist-card');
    if (!card) return;
    loadPlaylist(parseInt(card.dataset.index, 10));
    playerEl.closest('.player-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (typeof ScrollTrigger !== 'undefined') {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }
}
/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initKineticTypography();
  initSmoothScroll();
  renderLatestUpdates();
  initDeenPlaylists();
  initScrollAnimations();
  initCardTilt3D();
  initExpandableCards();
  initResumeRequest();
  initContactForm();
  initCryptoPrices();
  initEmailCopy();
  initMagneticButtons();
});
