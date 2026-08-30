/* =========================================================
   PWA — service worker registration, update banner, install prompt
   ========================================================= */

/* ---------- Service worker registration + update banner ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            // "installed" + an existing controller means this is a genuine
            // update (not the very first install) — safe to notify.
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner(newWorker);
            }
          });
        });
      })
      .catch((err) => console.warn('[PWA] Service worker registration failed:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

function showUpdateBanner(worker) {
  if (document.getElementById('pwaUpdateBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwaUpdateBanner';
  banner.className = 'pwa-update-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = `
    <span>A new version is available</span>
    <button type="button" class="pwa-update-btn" id="pwaUpdateBtn">Refresh to update</button>
    <button type="button" class="pwa-banner-close" id="pwaUpdateClose" aria-label="Dismiss">&times;</button>
  `;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));

  document.getElementById('pwaUpdateBtn').addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  document.getElementById('pwaUpdateClose').addEventListener('click', () => {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 300);
  });
}

/* ---------- Install App prompt ---------- */
(function initInstallPrompt() {
  const DISMISS_KEY = 'pwa-install-dismissed';
  let deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function showInstallButton() {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === 'true') return;
    if (document.getElementById('pwaInstallBtn')) return;

    const btn = document.createElement('div');
    btn.id = 'pwaInstallBtn';
    btn.className = 'pwa-install-pill';
    btn.innerHTML = `
      <button type="button" class="pwa-install-action" id="pwaInstallAction">
        <i data-lucide="download"></i> Install App
      </button>
      <button type="button" class="pwa-install-close" id="pwaInstallClose" aria-label="Dismiss install prompt">&times;</button>
    `;
    document.body.appendChild(btn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    requestAnimationFrame(() => btn.classList.add('visible'));

    document.getElementById('pwaInstallAction').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      hideInstallButton();
      if (outcome === 'dismissed') localStorage.setItem(DISMISS_KEY, 'true');
    });
    document.getElementById('pwaInstallClose').addEventListener('click', () => {
      localStorage.setItem(DISMISS_KEY, 'true');
      hideInstallButton();
    });
  }

  function hideInstallButton() {
    const btn = document.getElementById('pwaInstallBtn');
    if (!btn) return;
    btn.classList.remove('visible');
    setTimeout(() => btn.remove(), 300);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
    localStorage.setItem(DISMISS_KEY, 'true');
  });
})();
