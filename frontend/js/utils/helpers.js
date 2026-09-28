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

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button class="btn-icon" onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;">&times;</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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

export function showEmpty(container, message = 'No data available', actionText = null, actionHref = null) {
  if (typeof container === 'string') container = qs(container);
  if (!container) return;
  let actionHtml = '';
  if (actionText && actionHref) {
    actionHtml = `<a href="${actionHref}" class="btn btn-primary mt-4">${escapeHtml(actionText)}</a>`;
  }
  container.innerHTML = `
    <div class="empty-state">
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
    retryHtml = `<button class="btn btn-secondary mt-2" id="retry-btn">Retry</button>`;
  }
  
  container.innerHTML = `
    <div class="empty-state">
      <p style="color:var(--color-error)">${escapeHtml(message)}</p>
      ${retryHtml}
    </div>
  `;
  
  if (retryFn) {
    container.querySelector('#retry-btn').addEventListener('click', retryFn);
  }
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
      setTimeout(() => btn.disabled = false, 5000); // Re-enable after 5s just in case
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
