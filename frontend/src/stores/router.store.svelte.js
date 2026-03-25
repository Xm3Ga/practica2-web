// ============================================
// Router Store — Svelte 5 Runes
// ============================================

function getHash() {
  return window.location.hash.slice(1) || '/';
}

let currentRoute = $state(getHash());
let routeParam = $state('');

// Listen for hash changes
$effect.root(() => {
  $effect(() => {
    function onHashChange() {
      const hash = getHash();
      // Extract route param (e.g., /productos/123 → param = 123)
      const parts = hash.split('/').filter(Boolean);
      if (parts.length >= 2) {
        currentRoute = '/' + parts[0];
        routeParam = parts.slice(1).join('/');
      } else {
        currentRoute = hash;
        routeParam = '';
      }
    }

    window.addEventListener('hashchange', onHashChange);
    onHashChange(); // Initialize

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  });
});

function navigate(path) {
  window.location.hash = path;
}

export const routerStore = {
  get route() { return currentRoute; },
  get param() { return routeParam; },
  navigate,
};
