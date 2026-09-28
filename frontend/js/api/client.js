const API_BASE = '/api/v1';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  // Ensure clean endpoint path without duplicate /api/v1
  const cleanEndpoint = endpoint.startsWith('/api/v1') ? endpoint.slice(7) : endpoint;

  try {
    const response = await fetch(`${API_BASE}${cleanEndpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        code: response.status,
        message: data.error?.message || data.error || data.message || 'An error occurred',
        details: data
      };
    }

    return data;
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 500,
      message: 'Network error or server is unreachable',
      details: error
    };
  }
}

export const api = {
  // Generic HTTP methods
  get(endpoint, options = {}) {
    return apiRequest(endpoint, { method: 'GET', ...options });
  },
  post(endpoint, body, options = {}) {
    return apiRequest(endpoint, { method: 'POST', body, ...options });
  },
  put(endpoint, body, options = {}) {
    return apiRequest(endpoint, { method: 'PUT', body, ...options });
  },
  patch(endpoint, body, options = {}) {
    return apiRequest(endpoint, { method: 'PATCH', body, ...options });
  },
  delete(endpoint, options = {}) {
    return apiRequest(endpoint, { method: 'DELETE', ...options });
  },

  // Resource namespaces
  auth: {
    register(data) { return apiRequest('/auth/register', { method: 'POST', body: data }); },
    login(data) { return apiRequest('/auth/login', { method: 'POST', body: data }); },
    logout() { return apiRequest('/auth/logout', { method: 'POST' }); },
    me() { return apiRequest('/auth/me'); }
  },
  students: {
    me() { return apiRequest('/students/me'); },
    updateMe(data) { return apiRequest('/students/me', { method: 'PATCH', body: data }); },
    myQr() { return apiRequest('/students/me/qr'); },
    myEvents() { return apiRequest('/students/me/events'); },
    myAttendance() { return apiRequest('/students/me/attendance'); }
  },
  events: {
    list(params) {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest(`/events${qs}`);
    },
    get(id) { return apiRequest(`/events/${id}`); },
    create(data) { return apiRequest('/events', { method: 'POST', body: data }); },
    update(id, data) { return apiRequest(`/events/${id}`, { method: 'PATCH', body: data }); },
    publish(id) { return apiRequest(`/events/${id}/publish`, { method: 'POST' }); },
    cancel(id) { return apiRequest(`/events/${id}/cancel`, { method: 'POST' }); },
    delete(id) { return apiRequest(`/events/${id}`, { method: 'DELETE' }); }
  },
  registrations: {
    register(eventId) { return apiRequest(`/events/${eventId}/register`, { method: 'POST' }); },
    cancel(eventId) { return apiRequest(`/events/${eventId}/register`, { method: 'DELETE' }); },
    mine() { return apiRequest('/registrations/me'); },
    forEvent(eventId) { return apiRequest(`/events/${eventId}/registrations`); }
  },
  attendance: {
    scan(eventId, qrToken) { return apiRequest(`/events/${eventId}/attendance/scan`, { method: 'POST', body: { qrToken } }); },
    forEvent(eventId) { return apiRequest(`/events/${eventId}/attendance`); },
    async export(eventId, format = 'xlsx') {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/events/${eventId}/attendance/export?format=${format}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    }
  },
  notices: {
    list() { return apiRequest('/notices'); },
    create(data) { return apiRequest('/notices', { method: 'POST', body: data }); },
    update(id, data) { return apiRequest(`/notices/${id}`, { method: 'PATCH', body: data }); },
    delete(id) { return apiRequest(`/notices/${id}`, { method: 'DELETE' }); }
  }
};

export default api;
export { apiRequest };
