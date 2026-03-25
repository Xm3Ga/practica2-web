// ============================================
// Toast Store — Svelte 5 Runes
// ============================================

let toasts = $state([]);
let nextId = 0;

function addToast(message, type = 'info', duration = 4000) {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];

  // Auto-dismiss
  setTimeout(() => {
    removeToast(id);
  }, duration);
}

function removeToast(id) {
  toasts = toasts.filter(t => t.id !== id);
}

function success(message) {
  addToast(message, 'success');
}

function error(message) {
  addToast(message, 'error', 5000);
}

function warning(message) {
  addToast(message, 'warning');
}

function info(message) {
  addToast(message, 'info');
}

export const toastStore = {
  get toasts() { return toasts; },
  success,
  error,
  warning,
  info,
  removeToast,
};
