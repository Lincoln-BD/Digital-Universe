/* =========================================================
   SPACE.JS — the living background of the whole site.

   HOME      → a procedural Interstellar-style "Gargantua" black hole,
               raymarched in a GLSL fragment shader (Three.js):
                 • Schwarzschild light bending (gravitational lensing)
                 • volumetric, turbulent accretion disk, Keplerian shear
                 • relativistic Doppler beaming + gravitational redshift
                 • razor-sharp photon ring around a pure-black horizon
                 • 2-level bloom, film dither, mouse-driven 3D camera tilt
   SUBPAGES  → a distinct procedural cosmic view per page
               (nebula / spiral galaxy / universe panorama / still sky / pink nebula)

   PERFORMANCE SAFETY NET
     • pixel ratio = Math.min(devicePixelRatio, 2) × adaptive quality
     • 60 FPS cap (skips frames on 90/120/144 Hz screens)
     • frame-time watchdog: lowers resolution step by step, drops bloom,
       and finally swaps to a lightweight 2D particle canvas
     • software renderers / no WebGL / lost context → 2D fallback at once
     • pauses when the tab is hidden; half-rate once the hero is scrolled away

   Debug switches (URL):  ?gl=off  force 2D fallback   ?gl=force  ignore GPU checks
                          ?q=0.5   start quality       ?still=1   freeze time
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var canvas = doc.getElementById('space');
  if (!canvas) return;

  var qs = new URLSearchParams(location.search);
  var page = (doc.body.getAttribute('data-page') || 'home');
  var isHome = page === 'home';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var smallScreen = window.matchMedia('(max-width: 768px)').matches;
  var still = qs.get('still') === '1';

  /* ---------- per-page cosmic views ----------
     style: 0 nebula · 1 spiral galaxy · 2 universe panorama · 3 still sky · 4 pink nebula
     Colours are chosen from blue / silver / star-white / nebula-pink only.            */
  var PAGES = {
    about:     { style: 0, a: [0.25, 0.64, 1.00], b: [0.10, 0.85, 1.00] },
    journey:   { style: 1, a: [0.72, 0.80, 0.95], b: [0.55, 0.75, 1.00] },
    career:    { style: 2, a: [0.80, 0.88, 1.00], b: [0.60, 0.80, 1.00] },
    insights:  { style: 0, a: [0.22, 0.58, 1.00], b: [0.55, 0.90, 1.00] },
    football:  { style: 1, a: [0.80, 0.85, 0.95], b: [0.40, 0.70, 1.00] },
    'tech-ai': { style: 2, a: [0.20, 0.75, 1.00], b: [0.60, 0.95, 1.00] },
    crypto:    { style: 1, a: [0.85, 0.88, 0.95], b: [0.45, 0.72, 1.00] },
    movies:    { style: 4, a: [1.00, 0.37, 0.64], b: [1.00, 0.62, 0.30] },
    deen:      { style: 3, a: [0.95, 0.95, 1.00], b: [1.00, 0.85, 0.55] },
    connect:   { style: 4, a: [1.00, 0.40, 0.66], b: [1.00, 0.70, 0.40] }
  };
  var cfg = PAGES[page] || PAGES.about;

  /* ---------- shared input state ---------- */
  var mouse = { tx: 0, ty: 0, x: 0, y: 0, seen: false };
  var scrollY = window.scrollY || 0;
  if (finePointer) {
    window.addEventListener('pointermove', function (e) {
      mouse.seen = true;
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }
  window.addEventListener('scroll', function () { scrollY = window.scrollY || 0; }, { passive: true });

  /* =====================================================
     GPU CHECK
     ===================================================== */
  function probeGPU() {
    if (qs.get('gl') === 'off') return { ok: false, why: 'forced-off' };
    if (typeof THREE === 'undefined') return { ok: false, why: 'no-three' };
    var gl = null, renderer = '', ok = false;
    try {
      var c = doc.createElement('canvas');
      gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      ok = !!gl;
      if (gl) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    } catch (e) { ok = false; }
    if (!ok) return { ok: false, why: 'no-webgl' };
    var software = /swiftshader|llvmpipe|softpipe|software|microsoft basic/i.test(renderer);
    if (software && qs.get('gl') !== 'force') return { ok: false, why: 'software:' + renderer };
    var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
               (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
               (navigator.connection && navigator.connection.saveData);
    return { ok: true, weak: !!weak, renderer: renderer };
  }

  /* =====================================================
     2D FALLBACK — light particle canvas (stars + glow; home gets a faux horizon)
     ===================================================== */
  var fallback = null;
  function start2D(reason) {
    if (fallback) return;
    root.classList.add('perf-low', 'fx-2d');
    try { canvas.style.display = 'none'; } catch (e) {}
    var c = doc.getElementById('space2d');
    if (!c) { c = doc.createElement('canvas'); c.id = 'space2d'; c.setAttribute('aria-hidden', 'true'); canvas.parentNode.insertBefore(c, canvas.nextSibling); }
    var ctx = c.getContext('2d');
    var W = 0, H = 0, dpr = 1, stars = [], parts = [], raf = 0, last = 0;
    var accent = isHome ? [255, 176, 48] : cfg.a.map(function (v) { return Math.round(v * 255); });

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.width = Math.floor(window.innerWidth * dpr * 0.75);
      H = c.height = Math.floor(window.innerHeight * dpr * 0.75);
      c.style.width = '100%'; c.style.height = '100%';
      var n = smallScreen ? 90 : 160;
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.25 + 0.03, p: Math.random() * 6.28 });
      parts = [];
      if (isHome) for (var j = 0; j < (smallScreen ? 70 : 140); j++) parts.push({ a: Math.random() * 6.28, r: 1.15 + Math.random() * 1.1, sp: (Math.random() * 0.5 + 0.5), y: (Math.random() - 0.5) * 0.06 });
    }
    size();
    window.addEventListener('resize', size);

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (doc.hidden) return;
      if (t - last < 33) return;                       // ≤30 fps is plenty for the fallback
      last = t;
      var tt = t * 0.001;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

      if (!isHome) {                                    // soft accent glow
        var g = ctx.createRadialGradient(W * (0.7 + mouse.x * 0.03), H * 0.35, 0, W * 0.7, H * 0.35, Math.max(W, H) * 0.7);
        g.addColorStop(0, 'rgba(' + accent.join(',') + ',0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.y += s.s; if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        var a = 0.45 + 0.55 * Math.sin(tt * 1.3 + s.p);
        ctx.fillStyle = 'rgba(245,248,255,' + a.toFixed(2) + ')';
        ctx.fillRect(s.x + mouse.x * s.r * 6, s.y, s.r, s.r);
      }
      if (isHome) {
        var cx = W / 2 + mouse.x * W * 0.02, cy = H * 0.46, R = Math.min(W, H) * 0.22;
        var halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 2.4);
        halo.addColorStop(0, 'rgba(255,190,80,0.55)'); halo.addColorStop(0.4, 'rgba(255,120,20,0.18)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
        for (var k = 0; k < parts.length; k++) {         // orbiting plasma specks (flattened disk)
          var p = parts[k]; p.a += 0.006 * p.sp / Math.pow(p.r, 1.5) * 4;
          var px = cx + Math.cos(p.a) * R * p.r * 1.8, py = cy + Math.sin(p.a) * R * p.r * (0.14 + 0.02 * p.y) * 1.8 + p.y * R * 3;
          var front = Math.sin(p.a) > 0;
          ctx.fillStyle = 'rgba(255,' + (170 + (k % 70)) + ',' + (60 + (k % 80)) + ',' + (front ? 0.9 : 0.55) + ')';
          ctx.fillRect(px, py, 2, 2);
        }
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832);  // pure-black horizon with a thin photon ring
        ctx.fillStyle = '#000'; ctx.fill();
        ctx.lineWidth = Math.max(1.5, R * 0.025); ctx.strokeStyle = 'rgba(255,236,190,0.95)'; ctx.shadowColor = 'rgba(255,170,40,0.9)'; ctx.shadowBlur = R * 0.25; ctx.stroke(); ctx.shadowBlur = 0;
      }
    }
    raf = requestAnimationFrame(frame);
    fallback = { reason: reason, stop: function () { cancelAnimationFrame(raf); } };
    root.setAttribute('data-space', '2d:' + reason);
  }

  /* =====================================================
     WEBGL PATH
     ===================================================== */
  var probe = probeGPU();
  if (!probe.ok) { start2D(probe.why); return; }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  } catch (e) { start2D('context-fail'); return; }
  renderer.setClearColor(0x000000, 1);

  var VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

  /* ---------- GARGANTUA (home) ---------- */
  var FRAG_GARGANTUA = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform vec2  uMouseP;',   // pointer in shader "p" space (height-normalised)
    'uniform vec2  uCam;',      // yaw, pitch (radians)
    'uniform float uFit;',      // >=0 shrink for portrait screens
    'uniform float uCenterY;',  // horizon centre, fraction from top
    'uniform float uSteps;',
    'uniform float uDetail;',   // 1 = 4 octaves, 0 = 3
    'uniform float uIntro;',    // 0..1
    'uniform float uDebug;',
    '',
    '#define PI 3.14159265',
    '#define MAXS 300',
    '#define R_IN 2.05',
    '#define R_OUT 10.5',
    '',
    'float hash13(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx+31.32); return fract((p.x+p.y)*p.z); }',
    'float vnoise(vec3 x){',
    '  vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);',
    '  return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x), mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),',
    '             mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x), mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y), f.z);',
    '}',
    'float fbm3(vec3 p){',
    '  float s = 0.5*vnoise(p); p *= 2.07;',
    '  s += 0.25*vnoise(p); p *= 2.03;',
    '  s += 0.125*vnoise(p);',
    '  float norm = 0.875;',
    '  if (uDetail > 0.5) { p *= 2.01; s += 0.0625*vnoise(p); norm = 0.9375; }',
    '  return s / norm;',
    '}',
    '',
    // black-body-ish ramp: ember -> molten orange -> gold -> star white
    'vec3 heat(float t){',
    '  t = max(t, 0.0);',
    '  vec3 c = mix(vec3(0.0), vec3(0.34,0.045,0.0), smoothstep(0.0,0.25,t));',
    '  c = mix(c, vec3(1.00,0.32,0.035), smoothstep(0.20,0.50,t));',
    '  c = mix(c, vec3(1.00,0.63,0.14),  smoothstep(0.45,0.75,t));',
    '  c = mix(c, vec3(1.00,0.84,0.48),  smoothstep(0.70,1.00,t));',
    '  c = mix(c, vec3(1.00,0.96,0.86),  smoothstep(0.95,1.30,t));',
    '  c = mix(c, vec3(0.95,0.98,1.00),  smoothstep(1.30,1.90,t));',
    '  return c;',
    '}',
    '',
    'vec3 starfield(vec3 d){',
    '  vec3 col = vec3(0.0);',
    '  for (int l = 0; l < 2; l++){',
    '    float sc = (l == 0) ? 64.0 : 30.0;',
    '    vec3 q = d*sc; vec3 id = floor(q); vec3 f = fract(q) - 0.5;',
    '    float h = hash13(id + float(l)*17.3);',
    '    vec3 off = vec3(hash13(id+1.7), hash13(id+3.1), hash13(id+5.3)) - 0.5;',
    '    float dist = length(f - off*0.6);',
    '    float rad = (l == 0) ? 0.07 : 0.11;',
    '    float br = smoothstep(rad, 0.0, dist) * step(0.935, h) * ((h-0.935)/0.065 + 0.25);',
    '    vec3 tint = mix(vec3(1.0,0.86,0.66), vec3(0.82,0.91,1.0), hash13(id+9.1));',
    '    col += br * tint * ((l == 0) ? 0.9 : 1.7);',
    '  }',
    '  return col;',
    '}',
    '',
    'void main(){',
    '  vec2 frag = vUv * uRes;',
    '  vec2 p = (frag - vec2(0.5*uRes.x, (1.0-uCenterY)*uRes.y)) / uRes.y;',
    '  p /= uFit;',
    // gravitational "micro-lens" that follows the pointer
    '  vec2 dm = p - uMouseP; float md = dot(dm,dm);',
    '  p += dm / (md + 0.02) * 0.0042;',
    '',
    '  float camR = 17.0 * (1.0 + 0.55*pow(1.0-uIntro, 2.0));',
    '  float cy = cos(uCam.x), sy = sin(uCam.x), cp = cos(uCam.y), sp = sin(uCam.y);',
    '  vec3 ro  = camR * vec3(cp*sy, sp, cp*cy);',
    '  vec3 fwd = normalize(-ro);',
    '  vec3 rgt = normalize(cross(fwd, vec3(0.0,1.0,0.0)));',
    '  vec3 upv = cross(rgt, fwd);',
    '  float focal = 1.636;',                         // 34 deg vertical FOV
    '  vec3 rd = normalize(p.x*rgt + p.y*upv + focal*fwd);',
    '',
    '  vec3 pos = ro; vec3 vel = rd;',
    '  vec3 hv = cross(pos, vel); float h2 = dot(hv, hv); float b = sqrt(h2);',
    '  vec3 col = vec3(0.0); float trans = 1.0; float captured = 0.0;',
    '',
    '  for (int i = 0; i < MAXS; i++){',
    '    if (float(i) >= uSteps) break;',
    '    float r2 = dot(pos,pos); float r = sqrt(r2);',
    '    if (r < 1.0){ captured = 1.0; break; }',
    '    if (r > 26.0 && dot(pos, vel) > 0.0) break;',
    '    float ay = abs(pos.y);',
    '    float dt = clamp(0.35*ay, 0.03 + 0.012*r, 0.7);',
    '    dt = min(dt, 0.045*(r-0.8) + 0.012);',
    '',
    '    float rc = length(pos.xz);',
    '    float H = 0.034*rc + 0.02;',
    '    if (rc > R_IN-0.4 && rc < R_OUT+1.6 && ay < 3.4*H){',
    '      float yv = pos.y / H;',
    '      float prof = exp(-yv*yv);',
    '      float rad = smoothstep(R_IN-0.2, R_IN+0.55, rc) * (1.0 - smoothstep(R_OUT-3.2, R_OUT+1.2, rc));',
    '      float omega = 2.4 / (rc*sqrt(rc));',                // Keplerian shear: inner gas spins faster
    '      float a = atan(pos.z, pos.x) + omega*uTime*0.55;',
    '      vec3 q = vec3(cos(a), sin(a), 0.0)*2.1 + vec3(0.0, 0.0, rc*3.3);',
    '      float n = fbm3(q);',
    '      float bands = 0.62 + 0.38*sin(rc*10.5 + n*5.5);',
    '      float dens = prof * rad * (0.12 + 1.7*n*n) * bands * (1.0 - uDebug);',
    '      float Tr = 1.32 * pow(R_IN/rc, 0.55);',
    '      vec3 tang = vec3(pos.z, 0.0, -pos.x) / max(rc, 1e-3);',  // orbital direction
    '      float beta = min(0.62, sqrt(0.5*rc)/max(rc-1.0, 0.2));',
    '      float gam = inversesqrt(1.0 - beta*beta);',
    '      float D = 1.0 / (gam*(1.0 - beta*dot(tang, -vel)));',   // relativistic Doppler factor
    '      float gz = sqrt(max(1.0 - 1.0/r, 0.05));',              // gravitational redshift
    '      float g = D*gz;',
    '      float Tobs = Tr * g * (0.72 + 0.55*n);',
    '      float lum = pow(g, 2.5) * (0.22 + Tobs*Tobs*1.15);',    // beaming x emissivity
    '      col += trans * heat(Tobs) * lum * dens * dt * 1.6;',
    '      trans *= exp(-dens*dt*1.35);',
    '      if (trans < 0.02) break;',
    '    }',
    '',
    '    vec3 acc = -1.5*h2*pos/(r2*r2*r);',                      // Schwarzschild geodesic (Rs = 1)
    '    vel = normalize(vel + acc*dt);',
    '    pos += vel*dt;',
    '  }',
    '',
    '  if (captured < 0.5){',
    '    col += trans * starfield(normalize(vel));',
    // photon ring: light that grazes the photon sphere (b ~ 3*sqrt(3)/2 Rs)
    '    float bc = 2.598;',
    '    float pxb = (17.0 / (uRes.y*focal)) / uFit;',
    '    float w = max(0.02, 1.25*pxb);',
    '    float db = b - bc;',
    '    float ring = exp(-max(db,0.0)/(1.7*w)) * smoothstep(-0.25*w, 0.45*w, db);',
    '    float side = clamp(p.x / (length(p)+1e-3), -1.0, 1.0);',
    '    float beam = clamp(1.0 - 0.5*side, 0.5, 1.5);',         // approaching (left) side is brighter
    '    vec3 ringCol = mix(vec3(1.0,0.86,0.52), vec3(1.0,0.97,0.88), 0.6);',
    '    col += ringCol * ring * 2.6 * beam * trans;',
    '    float halo = exp(-max(db,0.0)*1.15) * smoothstep(-0.1, 0.35, db);',
    '    col += vec3(1.0,0.55,0.12) * halo * 0.16 * beam * trans;',
    '  }',
    '',
    '  col += uDebug * vec3(0.0,1.0,0.0) * smoothstep(0.004, 0.0, abs(length(p)-0.253));',
    '  col *= smoothstep(0.0, 0.55, uIntro);',
    '  col = 1.0 - exp(-col*1.35);',                             // filmic-ish tone map
    '  col = pow(col, vec3(0.96));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  /* ---------- COSMOS (subpages) ---------- */
  var FRAG_COSMOS = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform vec2  uMouse;',
    'uniform float uScroll;',
    'uniform float uStyle;',
    'uniform vec3  uA;',
    'uniform vec3  uB;',
    'uniform float uIntro;',
    '',
    'float hash21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
    'float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);',
    '  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y); }',
    'float fbm(vec2 p){ float s=0.0, a=0.5; mat2 m = mat2(0.8,-0.6,0.6,0.8);',
    '  for(int i=0;i<5;i++){ s += a*vn(p); p = m*p*2.02 + 7.1; a *= 0.5; } return s/0.96875; }',
    '',
    'vec3 stars2(vec2 uv, float scale, float thr, float size){',
    '  vec2 g = uv*scale; vec2 id = floor(g); vec2 f = fract(g)-0.5;',
    '  float h = hash21(id); vec2 off = (vec2(hash21(id+1.3),hash21(id+2.7))-0.5)*0.7;',
    '  float d = length(f-off);',
    '  float tw = 0.72 + 0.28*sin(uTime*(0.8+2.5*h) + h*40.0);',
    '  float s = smoothstep(size, 0.0, d) * step(thr, h) * tw * ((h-thr)/(1.0-thr)+0.3);',
    '  vec3 tint = mix(vec3(1.0,0.90,0.74), vec3(0.80,0.90,1.0), hash21(id+5.1));',
    '  return tint*s;',
    '}',
    '',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;',
    '  vec2 par = uMouse*0.03;',
    '  float t = uTime;',
    '  float sc = uScroll;',
    '  vec3 col = vec3(0.0);',
    '  float starBoost = 1.0;',
    '',
    '  if (uStyle < 0.5){',                                         // ---- NEBULA
    '    vec2 p = uv*1.5 + vec2(sc*0.10 + par.x*2.0, -sc*0.16 + par.y*2.0);',
    '    vec2 q = vec2(fbm(p + vec2(0.0, t*0.012)), fbm(p + vec2(5.2,1.3) - t*0.010));',
    '    float f = fbm(p*1.1 + 2.2*q);',
    '    float d = smoothstep(0.42, 0.92, f);',
    '    col += mix(uA*0.34, uB, q.x) * d * 0.85;',
    '    col += vec3(0.86,0.95,1.0) * pow(smoothstep(0.70,1.0,f), 2.0) * 0.95;',
    '    float lane = fbm(p*2.4 + 7.0);',
    '    col *= 0.5 + 0.9*smoothstep(0.25, 0.7, lane);',
    '    starBoost = 1.0;',
    '  } else if (uStyle < 1.5){',                                   // ---- SPIRAL GALAXY
    '    vec2 c = vec2(0.30, 0.03) + par*1.5;',
    '    vec2 g = uv - c - vec2(0.0, -sc*0.05);',
    '    float tl = 0.55; g = mat2(cos(tl),-sin(tl),sin(tl),cos(tl))*g;',
    '    g.y /= 0.42;',
    '    float r = length(g)*2.3; float a = atan(g.y, g.x);',
    '    float spin = t*0.014;',
    '    float arms = pow(0.5 + 0.5*cos(2.0*a - 7.0*log(r+0.06) + spin), 1.8);',
    '    float disk = exp(-r*1.55); float bulge = exp(-r*r*13.0);',
    '    float clump = fbm(g*5.0 + vec2(spin*3.0));',
    '    float dens = disk * (0.18 + 1.35*arms) * (0.45 + 0.95*clump);',
    '    col += uA * dens * 0.95 + vec3(1.0,0.80,0.46) * bulge * 1.25 + vec3(0.92,0.96,1.0) * pow(dens, 2.0) * 1.3;',
    '    col *= 1.0 - 0.55*smoothstep(0.55, 0.8, fbm(g*8.0 + 3.0))*arms;',
    '    vec2 q2 = uv*1.2 + vec2(sc*0.05, 0.0);',
    '    col += uB * 0.10 * smoothstep(0.55, 0.95, fbm(q2*1.4 + 11.0 + par*3.0));',   // faint halo gas
    '    starBoost = 1.0 + dens*3.0;',
    '  } else if (uStyle < 2.5){',                                   // ---- UNIVERSE PANORAMA
    '    vec2 p = uv + par*1.2 + vec2(0.0, sc*0.04);',
    '    float an = 0.38; vec2 bc = mat2(cos(an),-sin(an),sin(an),cos(an))*p;',
    '    float band = exp(-pow(bc.y*2.2, 2.0));',
    '    float n = fbm(vec2(bc.x*3.0 + t*0.004, bc.y*6.0));',
    '    float dust = smoothstep(0.42, 0.78, fbm(bc*vec2(4.0,9.0) + 3.0));',
    '    vec3 warm = vec3(1.0,0.82,0.54);',
    '    col += mix(uA, warm, exp(-pow(bc.x*0.85, 2.0))) * band * (0.20 + 0.85*n) * (1.0 - 0.7*dust);',
    '    col += vec3(0.9,0.95,1.0) * pow(band, 6.0) * pow(n, 3.0) * 0.8;',
    '    starBoost = 1.0 + band*3.5;',
    '  } else if (uStyle < 3.5){',                                   // ---- STILL SKY (calm)
    '    vec2 p = uv*0.9 + par;',
    '    col += uB * 0.07 * smoothstep(0.35, 0.9, fbm(p + 4.0));',
    '    col += uA * 0.03 * smoothstep(0.4, 0.9, fbm(p*1.7 + 12.0));',
    '  } else {',                                                     // ---- PINK NEBULA
    '    vec2 p = uv*1.45 + vec2(sc*0.09 + par.x*2.0, -sc*0.14 + par.y*2.0);',
    '    vec2 q = vec2(fbm(p + vec2(0.0, t*0.012)), fbm(p + vec2(3.7,9.2) - t*0.010));',
    '    float f = fbm(p*1.05 + 2.0*q);',
    '    float d = smoothstep(0.52, 0.86, f);',
    '    col += uA * pow(d, 1.25) * 1.05;',
    '    col += vec3(1.0,0.80,0.74) * pow(smoothstep(0.80,1.0,f), 2.0) * 0.9;',
    '    float w = smoothstep(0.60, 0.9, fbm(p*0.8 + 9.0 - q*1.5));',
    '    col += uB * w * 0.32 * (1.0 - d);',
    '    col = max(col - 0.05, 0.0) * 1.12;',                       // crush dim fringes -> true black, never wine
    '  }',
    '',
    '  vec2 sp = uv + par*0.6;',
    '  vec3 st = stars2(sp + vec2(0.0, sc*0.010), 46.0, 0.94, 0.09)*0.85',
    '          + stars2(sp*1.0 + vec2(3.3, sc*0.020), 24.0, 0.93, 0.12)*1.15',
    '          + stars2(sp*0.8 + vec2(7.1, sc*0.035), 11.0, 0.90, 0.16)*1.5;',
    '  col += st * starBoost * 0.9;',
    '',
    '  col = max(col - 0.008, 0.0);',
    '  col *= smoothstep(0.0, 0.6, uIntro);',
    '  col = 1.0 - exp(-col*1.25);',
    '  float vg = smoothstep(1.25, 0.25, length(uv*vec2(0.9,1.0)));',
    '  col *= mix(0.55, 1.0, vg);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  /* ---------- bloom / composite ---------- */
  var FRAG_BLUR = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D tSrc;',
    'uniform vec2 uDir;',        // texel step * direction
    'uniform float uThresh;',
    'void main(){',
    '  vec3 c = texture2D(tSrc, vUv).rgb * 0.2270270270;',
    '  c += texture2D(tSrc, vUv + uDir*1.3846153846).rgb * 0.3162162162;',
    '  c += texture2D(tSrc, vUv - uDir*1.3846153846).rgb * 0.3162162162;',
    '  c += texture2D(tSrc, vUv + uDir*3.2307692308).rgb * 0.0702702703;',
    '  c += texture2D(tSrc, vUv - uDir*3.2307692308).rgb * 0.0702702703;',
    '  c = max(c - uThresh, 0.0);',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  var FRAG_COMPOSITE = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D tMain; uniform sampler2D tB1; uniform sampler2D tB2;',
    'uniform float uBloom; uniform float uTime; uniform vec2 uRes;',
    'float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }',
    'void main(){',
    '  vec3 c = texture2D(tMain, vUv).rgb;',
    '  vec3 b = texture2D(tB1, vUv).rgb*0.5 + texture2D(tB2, vUv).rgb*0.6;',
    '  c += b * uBloom;',
    '  c = vec3(1.0) - exp(-c * 1.35);',                              // soft tone-map: keeps gold in the hot core, no flat white blob
    '  float v = smoothstep(1.05, 0.28, length((vUv-0.5)*vec2(1.15,1.0)));',
    '  c *= mix(0.62, 1.0, v);',
    '  c += (h(vUv*uRes + fract(uTime)) - 0.5) / 190.0;',            // dither: no banding in the dark gradients
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  /* ---------- scene plumbing ---------- */
  var quadGeo = new THREE.PlaneGeometry(2, 2);
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  function makePass(frag, uniforms) {
    var mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms: uniforms, depthTest: false, depthWrite: false });
    var mesh = new THREE.Mesh(quadGeo, mat); mesh.frustumCulled = false;
    var scene = new THREE.Scene(); scene.add(mesh);
    return { scene: scene, mat: mat };
  }
  function makeRT(w, h) {
    return new THREE.WebGLRenderTarget(Math.max(2, w | 0), Math.max(2, h | 0), {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat,
      depthBuffer: false, stencilBuffer: false
    });
  }

  var U = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uIntro: { value: 0 }
  };
  var mainPass, blurH1, blurV1, blurH2, blurV2, comp;

  if (isHome) {
    U.uMouseP = { value: new THREE.Vector2(9, 9) };
    U.uCam = { value: new THREE.Vector2(0, 0.17) };
    U.uFit = { value: 1 };
    U.uCenterY = { value: 0.46 };
    U.uSteps = { value: 280 };
    U.uDetail = { value: 1 };
    U.uDebug = { value: qs.get('debug') === '1' ? 1 : 0 };
    mainPass = makePass(FRAG_GARGANTUA, U);
  } else {
    U.uMouse = { value: new THREE.Vector2(0, 0) };
    U.uScroll = { value: 0 };
    U.uStyle = { value: cfg.style };
    U.uA = { value: new THREE.Vector3(cfg.a[0], cfg.a[1], cfg.a[2]) };
    U.uB = { value: new THREE.Vector3(cfg.b[0], cfg.b[1], cfg.b[2]) };
    mainPass = makePass(FRAG_COSMOS, U);
  }

  var rtMain = null, rtA1 = null, rtB1 = null, rtA2 = null, rtB2 = null;
  var useBloom = isHome;
  if (isHome) {
    blurH1 = makePass(FRAG_BLUR, { tSrc: { value: null }, uDir: { value: new THREE.Vector2() }, uThresh: { value: 0.5 } });
    blurV1 = makePass(FRAG_BLUR, { tSrc: { value: null }, uDir: { value: new THREE.Vector2() }, uThresh: { value: 0.0 } });
    blurH2 = makePass(FRAG_BLUR, { tSrc: { value: null }, uDir: { value: new THREE.Vector2() }, uThresh: { value: 0.0 } });
    blurV2 = makePass(FRAG_BLUR, { tSrc: { value: null }, uDir: { value: new THREE.Vector2() }, uThresh: { value: 0.0 } });
    comp = makePass(FRAG_COMPOSITE, {
      tMain: { value: null }, tB1: { value: null }, tB2: { value: null },
      uBloom: { value: 1 }, uTime: U.uTime, uRes: U.uRes
    });
  }

  /* ---------- quality / size management ---------- */
  var QMIN = isHome ? 0.34 : 0.3;
  var quality = parseFloat(qs.get('q'));
  if (!(quality > 0)) {
    if (isHome) quality = (probe.weak || smallScreen) ? 0.7 : ((window.devicePixelRatio || 1) > 1.5 ? 0.8 : 1.0);
    else quality = smallScreen ? 0.42 : 0.55;                  // soft backgrounds don't need full resolution
  }
  if (reduce && isHome) quality = Math.min(quality, 0.8);
  var vw = 0, vh = 0;
  var tmpV = new THREE.Vector2();

  function applySize() {
    vw = window.innerWidth; vh = window.innerHeight;
    var pr = Math.min(window.devicePixelRatio || 1, 2) * quality;      // <- the adaptive pixel ratio
    renderer.setPixelRatio(pr);
    renderer.setSize(vw, vh, false);
    renderer.getDrawingBufferSize(tmpV);
    U.uRes.value.copy(tmpV);
    if (isHome) {
      var aspect = vw / vh;
      U.uFit.value = Math.min(1, aspect / 1.15);                       // portrait phones: shrink the hole, keep the whole scene
      U.uCenterY.value = aspect < 0.8 ? 0.36 : 0.45;
      if (rtMain) { rtMain.dispose(); rtA1.dispose(); rtB1.dispose(); rtA2.dispose(); rtB2.dispose(); }
      var W = tmpV.x, H = tmpV.y;
      rtMain = makeRT(W, H);
      rtA1 = makeRT(W / 4, H / 4); rtB1 = makeRT(W / 4, H / 4);
      rtA2 = makeRT(W / 8, H / 8); rtB2 = makeRT(W / 8, H / 8);
      blurH1.mat.uniforms.uDir.value.set(1 / rtA1.width, 0);
      blurV1.mat.uniforms.uDir.value.set(0, 1 / rtB1.height);
      blurH2.mat.uniforms.uDir.value.set(1 / rtA2.width, 0);
      blurV2.mat.uniforms.uDir.value.set(0, 1 / rtB2.height);
    }
    var low = quality < 0.62;
    root.classList.toggle('perf-low', low);
  }
  applySize();
  var resizeT = 0;
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(applySize, 120); });

  function applyTier() {
    if (!isHome) return;
    U.uSteps.value = quality >= 0.8 ? 280 : (quality >= 0.55 ? 230 : 190);
    U.uDetail.value = quality >= 0.55 ? 1 : 0;
    useBloom = quality >= 0.42;
  }
  applyTier();

  /* ---------- context loss -> fallback ---------- */
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); halt(); start2D('context-lost'); }, false);

  /* ---------- render ---------- */
  function renderFrame() {
    if (isHome) {
      renderer.setRenderTarget(rtMain); renderer.render(mainPass.scene, cam);
      if (useBloom) {
        blurH1.mat.uniforms.tSrc.value = rtMain.texture; renderer.setRenderTarget(rtA1); renderer.render(blurH1.scene, cam);
        blurV1.mat.uniforms.tSrc.value = rtA1.texture;   renderer.setRenderTarget(rtB1); renderer.render(blurV1.scene, cam);
        blurH2.mat.uniforms.tSrc.value = rtB1.texture;   renderer.setRenderTarget(rtA2); renderer.render(blurH2.scene, cam);
        blurV2.mat.uniforms.tSrc.value = rtA2.texture;   renderer.setRenderTarget(rtB2); renderer.render(blurV2.scene, cam);
      }
      comp.mat.uniforms.tMain.value = rtMain.texture;
      comp.mat.uniforms.tB1.value = useBloom ? rtB1.texture : rtMain.texture;
      comp.mat.uniforms.tB2.value = useBloom ? rtB2.texture : rtMain.texture;
      comp.mat.uniforms.uBloom.value = useBloom ? 1.0 : 0.0;
      renderer.setRenderTarget(null); renderer.render(comp.scene, cam);
    } else {
      renderer.setRenderTarget(null); renderer.render(mainPass.scene, cam);
    }
  }

  var startT = performance.now();
  var simT = 0, lastNow = 0, lastDraw = 0;
  var raf = 0, running = false, halted = false;
  var FRAME_MS = 1000 / 60;                                  // 60 FPS cap
  var introDur = reduce ? 0.01 : 3200;

  var samples = [], warm = 0, adapts = 0, slowStrikes = 0, stillFrames = 0;

  function ease(x) { return 1 - Math.pow(1 - x, 3); }

  function update(now, dt) {
    var timeScale = (reduce || still) ? (still ? 0 : 0.22) : 1;
    simT += dt * timeScale;
    U.uTime.value = simT;
    var intro = still ? 1 : Math.min(1, (now - startT) / introDur);
    U.uIntro.value = ease(intro);
    var k = 1 - Math.pow(0.001, dt);                          // frame-rate independent smoothing
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, k * 1.2);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, k * 1.2);
    var m = reduce ? 0.2 : 1;
    if (isHome) {
      var drift = reduce ? 0 : Math.sin(simT * 0.09) * 0.035;
      U.uCam.value.set(mouse.x * 0.16 * m + drift, 0.17 + mouse.y * 0.11 * m + Math.sin(simT * 0.07) * (reduce ? 0 : 0.012));
      // pointer (NDC) -> shader "p" space: height-normalised, origin at the hole centre
      var aspect = vw / vh, fit = U.uFit.value;
      if (finePointer && mouse.seen) {
        U.uMouseP.value.set(mouse.x * 0.5 * aspect / fit, (mouse.y * 0.5 + U.uCenterY.value - 0.5) / fit);
      } else {
        U.uMouseP.value.set(9, 9);                           // no pointer yet -> lens disabled
      }
      var dim = Math.min(0.86, Math.max(0, (scrollY - vh * 0.15) / (vh * 0.9)));
      root.style.setProperty('--dim', dim.toFixed(3));
      return dim;
    }
    U.uMouse.value.set(mouse.x * m, mouse.y * m);
    U.uScroll.value += ((scrollY / vh) - U.uScroll.value) * Math.min(1, k * 0.6);
    return 0;
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (doc.hidden || halted) return;
    var since = now - lastDraw;
    var minGap = (isHome && scrollY > vh * 1.1) ? 1000 / 30 : FRAME_MS;   // half-rate when hero is off-screen
    if (since < minGap - 1.5) return;                                      // 60 FPS cap
    var dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0.016;
    lastNow = now; lastDraw = now;
    update(now, dt);
    renderFrame();

    if (still) {                                             // debug / screenshots: draw a couple of frames, then stop
      if (++stillFrames >= 3) { cancelAnimationFrame(raf); running = false; root.setAttribute('data-space-still', '1'); }
      return;
    }

    // ---- frame-time watchdog ----
    if (warm < 24) { warm++; return; }                       // ignore shader compile + first frames
    samples.push(since);
    if (samples.length >= 36) {
      samples.sort(function (a, b) { return a - b; });
      var med = samples[samples.length >> 1];
      samples.length = 0;
      if (med > 26) {                                        // < ~38 fps
        slowStrikes++;
        if (slowStrikes >= 1) {
          slowStrikes = 0;
          if (quality > QMIN + 0.01) {
            quality = Math.max(QMIN, quality * 0.78); adapts++;
            applySize(); applyTier(); warm = 18;
          } else if (med > 42 || adapts >= 8) {
            halt(); start2D('too-slow'); return;
          } else { warm = 12; }
        }
      }
    }
  }

  function halt() {
    halted = true; cancelAnimationFrame(raf); running = false;
    try { renderer.dispose(); } catch (e) {}
  }

  function start() {
    if (running) return; running = true;
    raf = requestAnimationFrame(loop);
  }
  doc.addEventListener('visibilitychange', function () { lastNow = 0; });

  start();
  root.setAttribute('data-space', 'webgl');
  window.__space = { quality: function () { return quality; }, renderer: probe.renderer };
})();
