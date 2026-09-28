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
  return user ? JSON.parse(user) : null;
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
  return user ? user.role : null;
}

export function requireAuth(redirectTo = '/pages/auth/login.html') {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requireRole(role, redirectTo = '/pages/auth/login.html') {
  if (!requireAuth(redirectTo)) return false;
  if (getUserRole() !== role) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function logout() {
  removeToken();
  removeUser();
  window.location.href = '/pages/auth/login.html';
}
