/* CampusHub PWA Manager — Add to Home Screen, Standalone Detection & Offline Support */

let deferredInstallPrompt = null;

function ensurePwaMetaTags() {
  if (typeof document === 'undefined') return;

  // 1. Manifest Link
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
  }

  // 2. Theme Color
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    themeMeta.content = '#f5f1e7';
    document.head.appendChild(themeMeta);
  }

  // 3. Apple Mobile Web App Capable
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);
  }

  // 4. Apple Status Bar Style
  if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
    const statusMeta = document.createElement('meta');
    statusMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusMeta.content = 'default';
    document.head.appendChild(statusMeta);
  }

  // 5. Apple Touch Icon
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'apple-touch-icon';
    iconLink.href = '/assets/icons/apple-touch-icon.png';
    document.head.appendChild(iconLink);
  }
}

export function initPWA() {
  ensurePwaMetaTags();

  // 1. Detect Standalone Display Mode (Installed PWA on Android, iOS, or Desktop)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;

  if (isStandalone) {
    document.documentElement.classList.add('pwa-standalone');
    document.body?.classList.add('pwa-standalone');
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

  // 5. iOS Safari Add-To-Home-Screen guidance (if not installed)
  checkIosPrompt();
}

function checkIosPrompt() {
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isSafari = /safari/.test(window.navigator.userAgent.toLowerCase()) && !/chrome|crios|fxios/.test(window.navigator.userAgent.toLowerCase());

  if (isIos && isSafari && !isStandalone) {
    if (sessionStorage.getItem('pwa_ios_dismissed') === 'true') return;
    // Show iOS tip once after short delay
    setTimeout(() => {
      renderIosInstallTip();
    }, 4000);
  }
}

function renderIosInstallTip() {
  if (document.getElementById('pwaInstallBanner')) return;
  if (sessionStorage.getItem('pwa_ios_dismissed') === 'true') return;

  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-install-content">
      <img src="/assets/icons/icon-192.png" alt="CampusHub" class="pwa-install-icon">
      <div class="pwa-install-text">
        <div class="pwa-install-title">Install CampusHub</div>
        <div class="pwa-install-desc">Tap <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align:middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share then "Add to Home Screen"</div>
      </div>
    </div>
    <div class="pwa-install-actions">
      <button type="button" id="btnPwaIosDismiss" class="btn btn-ghost btn-sm" style="padding: 6px 10px;">Got it</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('btnPwaIosDismiss')?.addEventListener('click', () => {
    hideInstallBanner();
    sessionStorage.setItem('pwa_ios_dismissed', 'true');
  });
}

function renderInstallBanner() {
  if (document.getElementById('pwaInstallBanner')) return;
  if (document.body?.classList.contains('pwa-standalone')) return;
  if (sessionStorage.getItem('pwa_prompt_dismissed') === 'true') return;

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

  document.getElementById('btnPwaInstall')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideInstallBanner();
  });

  document.getElementById('btnPwaDismiss')?.addEventListener('click', () => {
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
