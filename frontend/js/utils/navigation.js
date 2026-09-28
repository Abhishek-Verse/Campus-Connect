import { getUser, logout } from '../auth/auth.js';

const navConfig = {
  STUDENT: [
    { label: 'Dashboard', href: '/pages/student/dashboard.html', icon: '📊' },
    { label: 'Events', href: '/pages/student/events.html', icon: '📅' },
    { label: 'My Events', href: '/pages/student/my-events.html', icon: '🎟️' },
    { label: 'My QR', href: '/pages/student/my-qr.html', icon: '📱' },
    { label: 'Attendance', href: '/pages/student/attendance.html', icon: '✅' },
    { label: 'Profile', href: '/pages/student/profile.html', icon: '👤' }
  ],
  CLUB_MEMBER: [
    { label: 'Club Dashboard', href: '/pages/club/dashboard.html', icon: '📊' },
    { label: 'Manage Events', href: '/pages/club/manage-events.html', icon: '📅' },
    { label: 'Create Event', href: '/pages/club/create-event.html', icon: '➕' },
    { label: 'Scanner', href: '/pages/club/scanner.html', icon: '📷' },
    { label: 'Attendance & Export', href: '/pages/club/attendance.html', icon: '✅' },
    { label: 'Notices', href: '/pages/club/notices.html', icon: '📢' }
  ]
};

export function renderNavigation(roleParam) {
  const user = getUser();
  const userRole = (user?.role || '').toUpperCase();
  const isClubUser = userRole === 'CLUB_MEMBER' || userRole === 'ADMIN' || user?.isClubMember;

  const currentPath = window.location.pathname;
  const isClubPage = currentPath.includes('/pages/club/');
  
  // Choose menu based on current page context or param
  const activeSection = isClubPage ? 'CLUB_MEMBER' : 'STUDENT';
  const navItems = navConfig[activeSection] || navConfig.STUDENT;

  let navHtml = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${currentPath === item.href ? 'active' : ''}">
      <span style="margin-right: var(--space-2)">${item.icon}</span> ${item.label}
    </a>
  `).join('');

  // Portal Switcher button for users who are club members
  let switcherBtn = '';
  if (isClubUser) {
    if (isClubPage) {
      switcherBtn = `
        <a href="/pages/student/dashboard.html" class="btn btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; margin-bottom: 12px; background: #f3f4f6; color: #1f2937; text-decoration: none; border: 1px solid #d1d5db; font-size: 13px; font-weight: 600; padding: 7px 10px; border-radius: 6px;">
          🎓 Switch to Student Portal
        </a>
      `;
    } else {
      switcherBtn = `
        <a href="/pages/club/dashboard.html" class="btn btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; margin-bottom: 12px; background: #eff6ff; color: #2563eb; text-decoration: none; border: 1px solid #bfdbfe; font-size: 13px; font-weight: 600; padding: 7px 10px; border-radius: 6px;">
          🏛️ Switch to Club Portal
        </a>
      `;
    }
  }

  const portalBadge = isClubPage
    ? `<span style="background: #eff6ff; color: #2563eb; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 700; border: 1px solid #bfdbfe;">CLUB PORTAL</span>`
    : `<span style="background: #f3f4f6; color: #4b5563; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; border: 1px solid #e5e7eb;">STUDENT PORTAL</span>`;

  const sidebarContent = `
    <div class="sidebar-header" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; border-bottom: 1px solid var(--color-border);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="color: #171717; text-decoration: none; font-weight: 800; font-size: 1.25rem;">CampusHub</a>
      </div>
      <div>${portalBadge}</div>
    </div>
    <nav class="sidebar-nav">
      ${navHtml}
    </nav>
    <div class="sidebar-footer" style="padding: 16px 20px; border-top: 1px solid var(--color-border); background: #fafafa;">
      ${switcherBtn}
      <div style="font-size: 0.875rem; font-weight: 600; color: #171717; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${user ? user.name : 'User'}
      </div>
      <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${user?.email || ''}
      </div>
      <button id="logout-btn-sidebar" class="btn btn-secondary btn-sm" style="width: 100%; font-weight: 500;">Logout</button>
    </div>
  `;

  // Take first 5 items for mobile bottom nav
  let bottomNavHtml = navItems.slice(0, 5).map(item => `
    <a href="${item.href}" class="bottom-nav-item ${currentPath === item.href ? 'active' : ''}">
      <span style="font-size: 1.25rem">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

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
