import { getUser, logout } from '../auth/auth.js';
import './pwa.js';

const icons = {
  dashboard: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  events: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  ticket: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>`,
  qr: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h2v2h-2z"/><path d="M18 14h3v3h-3z"/><path d="M14 18h3v3h-3z"/><path d="M19 19h2v2h-2z"/></svg>`,
  attendance: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  profile: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  create: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  scanner: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  notices: `<svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  logout: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

const navConfig = {
  STUDENT: [
    { label: 'Dashboard', href: '/pages/student/dashboard.html', iconSvg: icons.dashboard },
    { label: 'Events', href: '/pages/student/events.html', iconSvg: icons.events },
    { label: 'My Events', href: '/pages/student/my-events.html', iconSvg: icons.ticket },
    { label: 'My QR', href: '/pages/student/my-qr.html', iconSvg: icons.qr },
    { label: 'Attendance', href: '/pages/student/attendance.html', iconSvg: icons.attendance },
    { label: 'Profile', href: '/pages/student/profile.html', iconSvg: icons.profile }
  ],
  CLUB_MEMBER: [
    { label: 'Dashboard', href: '/pages/club/dashboard.html', iconSvg: icons.dashboard },
    { label: 'Manage Events', href: '/pages/club/manage-events.html', iconSvg: icons.events },
    { label: 'Create Event', href: '/pages/club/create-event.html', iconSvg: icons.create },
    { label: 'Scanner', href: '/pages/club/scanner.html', iconSvg: icons.scanner },
    { label: 'Attendance & Export', href: '/pages/club/attendance.html', iconSvg: icons.attendance },
    { label: 'Notices', href: '/pages/club/notices.html', iconSvg: icons.notices }
  ]
};

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function renderNavigation() {
  const user = getUser();
  const currentPath = window.location.pathname;
  const isClubPage = currentPath.includes('/pages/club/');
  
  const activeSection = isClubPage ? 'CLUB_MEMBER' : 'STUDENT';
  const navItems = navConfig[activeSection] || navConfig.STUDENT;

  const navHtml = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${currentPath === item.href ? 'active' : ''}">
      <span class="nav-icon-wrapper">${item.iconSvg}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  const portalBadge = isClubPage
    ? `<span class="portal-badge-club">CLUB PORTAL</span>`
    : `<span class="portal-badge-student">STUDENT PORTAL</span>`;

  const userName = user?.name || (isClubPage ? 'Club Organizer' : 'Student');
  const userEmail = user?.email || '';
  const initials = getInitials(userName);

  const sidebarContent = `
    <div class="sidebar-header">
      <div class="sidebar-brand-row">
        <a href="/" class="sidebar-brand" style="display: flex; align-items: center;">
          <img src="/assets/logo.png" alt="CampusHub" style="height: 44px; max-width: 180px; object-fit: contain;">
        </a>
        <button id="sidebar-close-btn" class="btn-ghost btn-sm visible-mobile" aria-label="Close Navigation" style="padding: 4px; display: none;">
          ${icons.close}
        </button>
      </div>
      <div>${portalBadge}</div>
    </div>
    <nav class="sidebar-nav">
      ${navHtml}
    </nav>
    <div class="sidebar-footer">
      <div class="user-profile-badge">
        <div class="user-avatar-initials">${initials}</div>
        <div class="user-meta-wrap">
          <div class="user-info-name" title="${userName}">${userName}</div>
          <div class="user-info-email" title="${userEmail}">${userEmail}</div>
        </div>
      </div>
      <button id="logout-btn-sidebar" class="btn btn-secondary btn-sm logout-btn">
        ${icons.logout}
        <span>Logout</span>
      </button>
    </div>
  `;

  // Mobile Bottom Navigation Bar (takes first 5 items)
  const bottomNavHtml = navItems.slice(0, 5).map(item => `
    <a href="${item.href}" class="bottom-nav-item ${currentPath === item.href ? 'active' : ''}">
      <span class="bottom-nav-icon">${item.iconSvg}</span>
      <span class="bottom-nav-label">${item.label}</span>
    </a>
  `).join('');

  // Setup sidebar DOM
  let sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = sidebarContent;
  } else {
    sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = sidebarContent;
    const layout = document.querySelector('.app-layout');
    if (layout) layout.insertBefore(sidebar, layout.firstChild);
  }

  // Setup backdrop overlay for mobile drawer
  let overlay = document.getElementById('sidebarOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);
  }

  // Inject mobile toggle button into topbar if present
  const topbar = document.getElementById('topbar') || document.querySelector('.topbar');
  if (topbar && !document.getElementById('mobileNavToggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileNavToggle';
    toggleBtn.className = 'topbar-mobile-toggle';
    toggleBtn.setAttribute('aria-label', 'Open navigation menu');
    toggleBtn.innerHTML = icons.menu;
    topbar.insertBefore(toggleBtn, topbar.firstChild);

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('drawer-open');
      overlay.classList.add('active');
    });
  }

  // Setup drawer close behaviors
  const closeBtn = document.getElementById('sidebar-close-btn');
  const closeDrawer = () => {
    sidebar.classList.remove('drawer-open');
    overlay.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close drawer when any nav link is tapped on mobile
  sidebar.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Setup bottom navigation DOM
  let bottomNav = document.getElementById('bottomNav');
  if (bottomNav) {
    bottomNav.innerHTML = bottomNavHtml;
  } else {
    bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    bottomNav.id = 'bottomNav';
    bottomNav.innerHTML = bottomNavHtml;
    const layout = document.querySelector('.app-layout');
    if (layout) layout.appendChild(bottomNav);
    else document.body.appendChild(bottomNav);
  }

  // Setup logout listener
  const logoutBtn = document.getElementById('logout-btn-sidebar');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}
