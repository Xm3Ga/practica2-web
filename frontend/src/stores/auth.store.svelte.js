// ============================================
// Auth Store — Svelte 5 Runes
// ============================================
// Uses $state() for token/user, $derived() for isAuthenticated/isAdmin/displayName
// Uses $effect() for localStorage persistence

/**
 * Decode JWT payload (base64url → JSON)
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Initialize from localStorage
const savedToken = localStorage.getItem('token');
const savedUser = savedToken ? decodeToken(savedToken) : null;

// $state() — core reactive state
let token = $state(savedToken);
let user = $state(savedUser);

// $derived() — computed values
const isAuthenticated = $derived(!!token && !!user);
const isAdmin = $derived(user?.role === 'admin');
const displayName = $derived(user?.username ?? 'Invitado');

// $effect() — persist token to localStorage whenever it changes
$effect.root(() => {
  $effect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  });
});

/**
 * Set auth state after login
 */
function setAuth(newToken) {
  token = newToken;
  user = decodeToken(newToken);
}

/**
 * Clear auth state (logout)
 */
function clearAuth() {
  token = null;
  user = null;
}

/**
 * Get current token value
 */
function getToken() {
  return token;
}

export const authStore = {
  get token() { return token; },
  get user() { return user; },
  get isAuthenticated() { return isAuthenticated; },
  get isAdmin() { return isAdmin; },
  get displayName() { return displayName; },
  setAuth,
  clearAuth,
  getToken,
};
