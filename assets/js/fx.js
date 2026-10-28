/* =========================================================
   FX — the "feel" layer
   1. Music (your own stay.mp3 file, OFF by default)
   2. Laser crosshair cursor with magnetic snap
   3. Plasma ripple on click
   4. Dock laser beam under the active tab
   5. Smooth veil transition between pages
   6. Slow parallax on the home image
   ========================================================= */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function lstore(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- 1. SOUND — plays your own file: assets/audio/stay.mp3 ---------- */
  var SFX = (function () {
    var SRC = 'assets/audio/stay.mp3', VOL = 0.5;
    var audio = null, on = false, missing = false, fade = 0, wantOn = lstore('sx-sound') === '1';
    function get() {
      if (audio) return audio;
      audio = new Audio(); audio.src = SRC; audio.loop = true; audio.preload = 'none'; audio.volume = 0;
      audio.addEventListener('error', function () { missing = true; on = false; paint(); });
      // keep the song position when moving between pages
      var t = parseFloat(store('sx-time') || '0'); if (t > 0) audio.addEventListener('loadedmetadata', function () { try { audio.currentTime = Math.min(t, (audio.duration || t) - 1); } catch (e) {} }, { once: true });
      window.addEventListener('pagehide', function () { if (!audio.paused) store('sx-time', String(audio.currentTime)); });
      return audio;
    }
    function ramp(to, ms, done) {
      cancelAnimationFrame(fade); var a = get(), from = a.volume, t0 = performance.now();
      (function step(n) { var p = Math.min(1, (n - t0) / ms); a.volume = Math.max(0, Math.min(1, from + (to - from) * p)); if (p < 1) fade = requestAnimationFrame(step); else if (done) done(); })(t0);
    }
    function paint() {
      var b = doc.getElementById('soundToggle'); if (!b) return;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', missing ? 'Music file not found' : on ? 'Mute music' : 'Play music');
      b.title = missing ? 'Add assets/audio/stay.mp3 to enable music' : on ? 'Mute music' : 'Play music';
      b.classList.toggle('disabled', missing);
      b.innerHTML = '<i data-lucide="' + (on ? 'volume-2' : 'volume-x') + '"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
    function set(v) {
      var a = get();
      if (v) {
        var pr = a.play();
        if (pr && pr.then) pr.then(function () { on = true; ramp(VOL, 1800); lstore('sx-sound', '1'); paint(); }).catch(function () { on = false; wantOn = lstore('sx-sound') === '1'; paint(); });
        on = true;
      } else { on = false; lstore('sx-sound', '0'); ramp(0, 700, function () { a.pause(); }); }
      paint();
    }
    return {
      toggle: function () { if (missing) return; set(!on); },
      resumeIfWanted: function () { if (wantOn && !on && !missing) { wantOn = false; set(true); } },
      click: function () {}, hover: function () {}, whoosh: function () {}, paint: paint
    };
  })();
  window.SFX = SFX;

  /* ---------- 2. CURSOR ---------- */
  var SNAP_SEL = 'a, button, .btn, [role="button"], input, textarea, select, summary, .hub-card, .insight-card, .connect-card, .playlist-card, [data-expand]';
  function initCursor() {
    if (!finePointer) return;
    root.classList.add('has-cursor');
    var cur = doc.createElement('div'); cur.className = 'sx-cursor'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<div class="sx-box"></div><div class="sx-cross"><i></i><i></i><i></i><i></i></div><div class="sx-dot"></div>';
    doc.body.appendChild(cur);
    var dot = cur.querySelector('.sx-dot'), cross = cur.querySelector('.sx-cross'), box = cur.querySelector('.sx-box');
    var mx = -100, my = -100, cx = mx, cy = my, tx = mx, ty = my, target = null, rect = null, shown = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; cx = mx; cy = my; cur.classList.add('on'); }
      var el = e.target && e.target.closest ? e.target.closest(SNAP_SEL) : null;
      if (el !== target) {
        target = el; rect = el ? el.getBoundingClientRect() : null;
        cur.classList.toggle('snap', !!el);
        if (el) SFX.hover();
      }
    }, { passive: true });
    window.addEventListener('scroll', function () { if (target) rect = target.getBoundingClientRect(); }, { passive: true });
    doc.addEventListener('pointerdown', function () { cur.classList.add('down'); });
    doc.addEventListener('pointerup', function () { cur.classList.remove('down'); });
    doc.addEventListener('mouseleave', function () { cur.classList.remove('on'); shown = false; });

    var bx = 0, by = 0, bw = 34, bh = 34, running = false;
    function wake() { if (!running) { running = true; requestAnimationFrame(loop); } }
    window.addEventListener('pointermove', wake, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    function loop() {
      // while snapped the crosshair is pulled toward the element's centre (magnetic)
      if (target && rect) {
        var rcx = rect.left + rect.width / 2, rcy = rect.top + rect.height / 2;
        tx = mx + (rcx - mx) * 0.22; ty = my + (rcy - my) * 0.22;
        var pad = 5;
        bx += (rect.left - pad - bx) * 0.3; by += (rect.top - pad - by) * 0.3;
        bw += (rect.width + pad * 2 - bw) * 0.3; bh += (rect.height + pad * 2 - bh) * 0.3;
      } else {
        tx = mx; ty = my;
        bx += (mx - 17 - bx) * 0.3; by += (my - 17 - by) * 0.3; bw += (34 - bw) * 0.3; bh += (34 - bh) * 0.3;
      }
      var d1 = Math.abs(tx - cx) + Math.abs(ty - cy);
      cx += (tx - cx) * 0.35; cy += (ty - cy) * 0.35;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      cross.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      box.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0)';
      box.style.width = bw + 'px'; box.style.height = bh + 'px';
      // sleep when everything has settled (saves CPU/battery); pointermove wakes it again
      var tgtW = target && rect ? rect.width + 10 : 34, tgtX = target && rect ? rect.left - 5 : mx - 17;
      if (d1 < 0.05 && Math.abs(bw - tgtW) < 0.05 && Math.abs(bx - tgtX) < 0.05) { running = false; return; }
      requestAnimationFrame(loop);
    }
    wake();
  }

  /* ---------- 3. PLASMA RIPPLE + click sound ---------- */
  function initRipple() {
    doc.addEventListener('pointerdown', function (e) {
      if (!(e.target.closest && e.target.closest('#soundToggle'))) SFX.resumeIfWanted();
      if (e.button > 0) return;
      SFX.click();
      if (reduce) return;
      ['', 'r2'].forEach(function (cls) {
        var r = doc.createElement('span'); r.className = 'plasma-ripple ' + cls;
        r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
        doc.body.appendChild(r); setTimeout(function () { r.remove(); }, 1300);
      });
    }, { passive: true });
    var tog = doc.getElementById('soundToggle');
    if (tog) { SFX.paint(); tog.addEventListener('click', function (e) { e.stopPropagation(); SFX.toggle(); }); }
  }

  /* ---------- 4. DOCK BEAM ---------- */
  var INSIGHT_CHILDREN = ['crypto', 'football', 'tech-ai', 'movies', 'deen'];
  function initDock() {
    var wrap = doc.querySelector('.dock-links-wrap'), beam = doc.getElementById('navIndicator');
    if (!wrap || !beam) return;
    var page = doc.body.getAttribute('data-page');
    var key = INSIGHT_CHILDREN.indexOf(page) > -1 ? 'insights' : page;
    var links = wrap.querySelectorAll('a[data-page]'), active = null;
    links.forEach(function (a) { if (a.getAttribute('data-page') === key) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); active = a; } });
    function metrics(a) { var w = wrap.getBoundingClientRect(), r = a.getBoundingClientRect(); return { x: r.left - w.left + r.width * 0.14, w: r.width * 0.72 }; }
    function put(m) { beam.style.setProperty('--bx', m.x + 'px'); beam.style.setProperty('--bw', m.w + 'px'); }
    if (!active) return;
    var to = metrics(active), from = null;
    try { from = JSON.parse(store('beamFrom') || 'null'); } catch (e) {}
    if (from && !reduce) {
      put(from); beam.classList.add('ready');
      requestAnimationFrame(function () { requestAnimationFrame(function () { beam.classList.add('slide'); put(to); }); });
    } else { put(to); beam.classList.add('ready'); }
    // hovering another tab previews the beam there
    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { beam.classList.add('slide'); put(metrics(a)); });
      a.addEventListener('mouseleave', function () { put(metrics(active)); });
      a.addEventListener('click', function () { store('beamFrom', JSON.stringify(metrics(a))); });
    });
    window.addEventListener('resize', function () { beam.classList.remove('slide'); put(metrics(active)); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { beam.classList.remove('slide'); put(metrics(active)); });
  }

  /* ---------- 5. PAGE TRANSITION (soft veil + drift/blur) ---------- */
  var veil = null;
  function getVeil() { if (!veil) { veil = doc.createElement('div'); veil.id = 'veil'; veil.setAttribute('aria-hidden', 'true'); doc.body.appendChild(veil); } return veil; }
  function isPageLink(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return false; }
    if (u.origin !== location.origin) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false; // same page / hash jump
    return /\.html?$|\/$/.test(u.pathname);
  }
  function initWarp() {
    var v = getVeil();
    if (root.classList.contains('warp-arrive')) {
      store('warp', '0');
      // two frames so the browser paints the hidden state first, then ease into view
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        root.classList.add('settling');
        var main = doc.querySelector('main');
        if (main) { main.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.9s cubic-bezier(0.22,1,0.36,1)'; }
        v.style.transition = 'opacity 0.8s cubic-bezier(0.65,0,0.35,1)';
        root.classList.remove('warp-arrive');
        setTimeout(function () { if (main) main.style.transition = ''; v.style.transition = ''; root.classList.remove('settling'); }, 1000);
      }); });
    }
    if (reduce) return;
    doc.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!isPageLink(a, e)) return;
      e.preventDefault();
      var href = a.href; store('warp', '1');
      root.classList.add('leaving'); v.classList.add('on');
      var go = function () { location.href = href; };
      setTimeout(go, 560);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { root.classList.remove('warp-arrive', 'leaving'); v.classList.remove('on'); }
    });
  }

  /* ---------- 6. HOME IMAGE PARALLAX (mouse / device tilt) ---------- */
  function initParallax() {
    var el = doc.querySelector('.bh-parallax');
    if (!el || reduce) return;
    function move(nx, ny) { el.style.transform = 'translate3d(' + (-nx * 22).toFixed(1) + 'px,' + (-ny * 14).toFixed(1) + 'px,0)'; }
    if (finePointer) window.addEventListener('pointermove', function (e) { move(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5); }, { passive: true });
    else window.addEventListener('deviceorientation', function (e) { if (e.gamma == null) return; move(Math.max(-1, Math.min(1, e.gamma / 30)) * 0.5, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * 0.5); }, { passive: true });
  }

  /* ---------- extras: "Enter" scroll button ---------- */
  function initScrollButtons() {
    doc.querySelectorAll('[data-scroll]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        var t = doc.querySelector(b.getAttribute('data-scroll')); if (!t) return;
        e.preventDefault();
        if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.scrollTo(t, { offset: -20 });
        else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function boot() { SFX.resumeIfWanted(); initWarp(); initCursor(); initRipple(); initDock(); initParallax(); initScrollButtons(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
