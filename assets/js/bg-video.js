/* =========================================================
   HOME BACKGROUND VIDEO  (assets/video/blackhole.mp4 / .webm)
   - muted, looping, no controls, plays inline on phones
   - the poster picture shows first, the video fades in once it is playing
   - respects reduced-motion and Save-Data (shows the poster + a "Play motion" button)
   - if autoplay is blocked (for example iPhone Low Power Mode) it starts on the first touch/click
   - pauses when the tab is hidden
   Debug: add ?bhdebug to the address to see the state.  Add ?live=off to keep the poster only.
   ========================================================= */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var v = doc.querySelector('.bh-video');
  if (!v) return;
  var qs = new URLSearchParams(location.search);
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var optIn = false; try { optIn = localStorage.getItem('bh-motion') === '1'; } catch (e) {}

  function state(s) { root.setAttribute('data-bh', s); badge(); }
  function badge() {
    if (!qs.has('bhdebug')) return;
    var d = doc.getElementById('bhDebug') || doc.body.appendChild(Object.assign(doc.createElement('div'), { id: 'bhDebug' }));
    d.style.cssText = 'position:fixed;left:10px;top:10px;z-index:99999;background:#000c;color:#ffd56b;font:12px/1.4 monospace;padding:6px 10px;border:1px solid #ffb52e;border-radius:6px;max-width:90vw';
    d.textContent = 'bh: ' + root.getAttribute('data-bh') + ' | reduced=' + mqReduce.matches + ' | saveData=' + saveData + ' | ready=' + v.readyState;
  }
  function motionButton(playing) {
    if (doc.getElementById('bhMotionBtn')) return;
    var b = doc.createElement('button'); b.id = 'bhMotionBtn'; b.type = 'button'; b.className = 'bh-motion-btn';
    b.textContent = playing ? 'Pause motion' : 'Play motion';
    b.setAttribute('aria-label', playing ? 'Pause background motion' : 'Play background motion');
    b.addEventListener('click', function () { try { localStorage.setItem('bh-motion', playing ? '0' : '1'); } catch (e) {} location.reload(); });
    doc.body.appendChild(b);
  }

  var blocked = qs.get('live') === 'off' || ((mqReduce.matches || saveData) && !optIn);
  if (blocked) {
    v.removeAttribute('autoplay'); v.preload = 'none'; try { v.pause(); } catch (e) {}
    if (qs.get('live') !== 'off') motionButton(false);
    return state('static:' + (qs.get('live') === 'off' ? 'forced' : mqReduce.matches ? 'reduced-motion' : 'save-data'));
  }
  if (mqReduce.matches && optIn) motionButton(true);

  v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
  v.addEventListener('playing', function () { v.classList.add('on'); state('video'); });
  v.addEventListener('error', function () { v.classList.remove('on'); state('static:video-error'); }, true);

  function tryPlay() {
    var p = v.play();
    if (p && p.catch) p.catch(function () {
      state('static:autoplay-blocked');
      var kick = function () { v.play().catch(function () {}); ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (e) { window.removeEventListener(e, kick); }); };
      ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (e) { window.addEventListener(e, kick, { passive: true }); });
    });
  }
  tryPlay();
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) v.pause(); else tryPlay(); });
  setTimeout(badge, 1200);
})();
