import { getUser, logout } from '../auth/auth.js';

const navConfig = {
  student: [
    { label: 'Dashboard', href: '/pages/student/dashboard.html', icon: '📊' },
    { label: 'Events', href: '/pages/student/events.html', icon: '📅' },
    { label: 'My Events', href: '/pages/student/my-events.html', icon: '🎟️' },
    { label: 'My QR', href: '/pages/student/qr.html', icon: '📱' },
    { label: 'Attendance', href: '/pages/student/attendance.html', icon: '✅' },
    { label: 'Profile', href: '/pages/student/profile.html', icon: '👤' }
  ],
  club: [
    { label: 'Dashboard', href: '/pages/club/dashboard.html', icon: '📊' },
    { label: 'Events', href: '/pages/club/events.html', icon: '📅' },
    { label: 'Create Event', href: '/pages/club/create-event.html', icon: '➕' },
    { label: 'Scanner', href: '/pages/club/scanner.html', icon: '📷' },
    { label: 'Attendance', href: '/pages/club/attendance.html', icon: '✅' },
    { label: 'Notices', href: '/pages/club/notices.html', icon: '📢' }
  ]
};

export function renderNavigation(role) {
  const user = getUser();
  const navItems = navConfig[role] || [];
  const currentPath = window.location.pathname;

  // Render Sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  let navHtml = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${currentPath.includes(item.href) ? 'active' : ''}">
      <span style="margin-right: var(--space-2)">${item.icon}</span> ${item.label}
    </a>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="/" style="color: inherit;">CampusHub</a>
    </div>
    <nav class="sidebar-nav">
      ${navHtml}
    </nav>
    <div class="sidebar-footer">
      <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: var(--space-2)">
        ${user ? user.name : 'User'}
      </div>
      <button id="logout-btn-sidebar" class="btn btn-secondary btn-sm w-full">Logout</button>
    </div>
  `;

  // Render Bottom Nav for Mobile
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  
  // Take first 5 items for bottom nav
  let bottomNavHtml = navItems.slice(0, 5).map(item => `
    <a href="${item.href}" class="bottom-nav-item ${currentPath.includes(item.href) ? 'active' : ''}">
      <span style="font-size: 1.25rem">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');
  
  bottomNav.innerHTML = bottomNavHtml;

  const layout = document.querySelector('.app-layout');
  if (layout) {
    layout.insertBefore(sidebar, layout.firstChild);
    layout.appendChild(bottomNav);
    
    // Setup logout listener
    const logoutBtn = document.getElementById('logout-btn-sidebar');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
}
