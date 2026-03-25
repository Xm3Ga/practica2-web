// ============================================
// API Service — fetch wrapper with JWT auth
// ============================================

const API_BASE = '/api';

/**
 * Get token from localStorage
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Core fetch wrapper
 */
async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401/403 globally — clear session
  if (response.status === 401 || response.status === 403) {
    const error = new Error(response.status === 401 ? 'No autorizado' : 'Acceso denegado');
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Error del servidor' };
    }
    const error = new Error(errorData.message || errorData.error || 'Error desconocido');
    error.status = response.status;
    throw error;
  }

  // Some endpoints return no content
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function get(endpoint) {
  return fetchApi(endpoint, { method: 'GET' });
}

export function post(endpoint, data) {
  const isFormData = data instanceof FormData;
  return fetchApi(endpoint, {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
  });
}

export function put(endpoint, data) {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function del(endpoint) {
  return fetchApi(endpoint, { method: 'DELETE' });
}
