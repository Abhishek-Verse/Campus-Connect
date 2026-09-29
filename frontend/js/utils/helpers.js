/* CampusHub UI/UX Helpers — Pro Max Edition */

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
}

export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-success);flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-error);flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-warning);flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;min-width:0;">
      ${icons[type] || icons.success}
      <span class="toast-message">${escapeHtml(message)}</span>
    </div>
    <button class="toast-close-btn" aria-label="Dismiss">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px) scale(0.96)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px) scale(0.96)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }
  }, 4000);
}

export function hideToast() {
  const container = document.querySelector('.toast-container');
  if (container) container.innerHTML = '';
}

export function showLoading(container) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"></div>';
}

export function hideLoading(container) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;
  const spinner = container.querySelector('.loading-spinner');
  if (spinner) spinner.remove();
}

/**
 * Render sleek shimmer skeleton event cards while fetching data
 */
export function renderSkeletonCards(container, count = 3) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;

  const skeletonHtml = Array.from({ length: count }).map(() => `
    <div class="card" style="display:flex;flex-direction:column;gap:12px;padding:16px;">
      <div class="skeleton" style="height:120px;border-radius:6px;width:100%;"></div>
      <div class="skeleton skeleton-text" style="width:70%;height:18px;"></div>
      <div class="skeleton skeleton-text" style="width:45%;height:13px;"></div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <div class="skeleton" style="width:30%;height:28px;border-radius:4px;"></div>
        <div class="skeleton" style="width:30%;height:28px;border-radius:4px;"></div>
      </div>
    </div>
  `).join('');

  container.innerHTML = skeletonHtml;
}

/**
 * Render shimmer skeleton rows for tables
 */
export function renderSkeletonRows(container, rowCount = 4, colCount = 4) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;

  const rowsHtml = Array.from({ length: rowCount }).map(() => `
    <tr>
      ${Array.from({ length: colCount }).map(() => `
        <td><div class="skeleton skeleton-text" style="width:${Math.floor(Math.random() * 40 + 50)}%;height:14px;margin:0;"></div></td>
      `).join('')}
    </tr>
  `).join('');

  container.innerHTML = rowsHtml;
}

export function showEmpty(container, message = 'No data available', actionText = null, actionHref = null) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;
  let actionHtml = '';
  if (actionText && actionHref) {
    actionHtml = `<a href="${actionHref}" class="btn btn-primary mt-2">${escapeHtml(actionText)}</a>`;
  }
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      </div>
      <h3>Nothing here yet</h3>
      <p>${escapeHtml(message)}</p>
      ${actionHtml}
    </div>
  `;
}

export function showError(container, message = 'An error occurred', retryFn = null) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;
  
  let retryHtml = '';
  if (retryFn) {
    retryHtml = `<button class="btn btn-secondary mt-3" id="retry-btn">Try Again</button>`;
  }
  
  container.innerHTML = `
    <div class="empty-state" style="border-color:var(--color-error-border);">
      <div class="empty-state-icon" style="background:var(--color-error-light);color:var(--color-error);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h3>Unable to load content</h3>
      <p style="color:var(--color-error);">${escapeHtml(message)}</p>
      ${retryHtml}
    </div>
  `;
  
  if (retryFn) {
    container.querySelector('#retry-btn').addEventListener('click', retryFn);
  }
}

/**
 * Universal Native Web Audio Synthesizer for instant audible feedback on scans
 * Zero external mp3 dependencies, works cross-platform on iOS/Android/Desktop
 */
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playScanSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Second higher harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.18, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.28);
  } catch (err) {
    // Audio might be blocked before first user gesture
  }
}

export function playScanErrorSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now); // A3 low alert
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    // Audio error fallback
  }
}

export async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast(successMessage, 'success');
      return true;
    }
  } catch (err) {
    // Fallback for older browsers
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage, 'success');
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
  textarea.remove();
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') el.className = val;
    else el.setAttribute(key, val);
  }
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => el.appendChild(child));
  }
  return el;
}

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

export function preventDoubleSubmit(form) {
  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      if (btn.disabled) {
        e.preventDefault();
        return false;
      }
      btn.disabled = true;
      setTimeout(() => btn.disabled = false, 4000);
    }
  });
}

export function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

export function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
