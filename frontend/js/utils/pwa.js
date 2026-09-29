/* CampusHub PWA Manager — Add to Home Screen & Standalone Detection */

let deferredInstallPrompt = null;

export function initPWA() {
  // 1. Detect Standalone Display Mode (Installed PWA on Android, iOS, or Desktop)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;

  if (isStandalone) {
    document.documentElement.classList.add('pwa-standalone');
    document.body.classList.add('pwa-standalone');
  }

  // 2. Register Service Worker
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          // SW registered successfully
        })
        .catch((err) => {
          console.warn('PWA service worker registration notice:', err);
        });
    });
  }

  // 3. Listen for browser Install Prompt (Chrome / Edge / Android)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderInstallBanner();
  });

  // 4. Track successful app install
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hideInstallBanner();
  });
}

function renderInstallBanner() {
  if (document.getElementById('pwaInstallBanner')) return;
  if (document.body.classList.contains('pwa-standalone')) return;

  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-install-content">
      <img src="/assets/icons/icon-192.png" alt="CampusHub" class="pwa-install-icon">
      <div class="pwa-install-text">
        <div class="pwa-install-title">Install CampusHub</div>
        <div class="pwa-install-desc">Add to Home Screen for fast offline QR pass & scanner</div>
      </div>
    </div>
    <div class="pwa-install-actions">
      <button type="button" id="btnPwaDismiss" class="btn btn-ghost btn-sm" style="padding: 6px 10px;">Later</button>
      <button type="button" id="btnPwaInstall" class="btn btn-primary btn-sm" style="padding: 6px 14px;">Install</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('btnPwaInstall').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideInstallBanner();
  });

  document.getElementById('btnPwaDismiss').addEventListener('click', () => {
    hideInstallBanner();
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  });
}

function hideInstallBanner() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(16px)';
    banner.style.transition = 'all 0.2s ease';
    setTimeout(() => banner.remove(), 200);
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  initPWA();
}
