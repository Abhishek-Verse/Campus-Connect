export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserRole() {
  const user = getUser();
  if (!user) return null;
  const role = (user.role || '').toUpperCase();
  if (role === 'CLUB_MEMBER' || role === 'ADMIN' || user.isClubMember) {
    return 'CLUB_MEMBER';
  }
  return role || 'STUDENT';
}

export function requireAuth(redirectTo = '/pages/auth/login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return getUser();
}

export function requireRole(expectedRole, redirectTo = '/pages/auth/login.html') {
  const user = requireAuth(redirectTo);
  if (!user) return false;
  
  const userRole = (user.role || '').toUpperCase();
  const target = (expectedRole || '').toUpperCase();

  const isClubAuthorized = (userRole === 'CLUB_MEMBER' || userRole === 'ADMIN' || user.isClubMember);
  if (target === 'CLUB_MEMBER' && !isClubAuthorized) {
    alert('Access Denied: The Club Portal is restricted to official Club Accounts. Student accounts cannot access club management.');
    window.location.href = '/pages/student/dashboard.html';
    return false;
  }

  if (userRole !== target && userRole !== 'ADMIN') {
    window.location.href = redirectTo;
    return false;
  }
  return user;
}

export function logout() {
  removeToken();
  removeUser();
  window.location.href = '/pages/auth/login.html';
}
