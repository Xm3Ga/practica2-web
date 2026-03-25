<script>
  import { authStore } from './stores/auth.store.svelte.js';
  import { routerStore } from './stores/router.store.svelte.js';

  import Navbar from './components/Navbar.svelte';
  import Toast from './components/Toast.svelte';

  import LoginPage from './pages/LoginPage.svelte';
  import RegisterPage from './pages/RegisterPage.svelte';
  import ProductsPage from './pages/ProductsPage.svelte';
  import ProductDetailPage from './pages/ProductDetailPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import AdminUsersPage from './pages/AdminUsersPage.svelte';

  // $derived() — determine which page to show
  const currentPage = $derived(() => {
    const route = routerStore.route;

    // Public pages (no auth required)
    if (route === '/login') return 'login';
    if (route === '/register') return 'register';

    // Protected pages — redirect to login if not authenticated
    if (!authStore.isAuthenticated) return 'login';

    if (route === '/productos') return 'products';
    if (route === '/perfil') return 'profile';
    if (route === '/admin') return 'admin-users';
    if (route === '/' || route === '') return 'products';

    return 'products'; // Default fallback
  });

  // $effect() — redirect to login when token is cleared
  $effect(() => {
    if (!authStore.isAuthenticated) {
      const route = routerStore.route;
      if (route !== '/login' && route !== '/register') {
        routerStore.navigate('/login');
      }
    }
  });
</script>

<Navbar />

<main>
  {#if currentPage() === 'login'}
    <LoginPage />
  {:else if currentPage() === 'register'}
    <RegisterPage />
  {:else if currentPage() === 'products'}
    <ProductsPage />
  {:else if currentPage() === 'profile'}
    <ProfilePage />
  {:else if currentPage() === 'admin-users'}
    <AdminUsersPage />
  {/if}

  <!-- ProductDetail is shown when route is /productos with a param -->
  {#if routerStore.route === '/productos' && routerStore.param}
    <div class="detail-overlay">
      <ProductDetailPage />
    </div>
  {/if}
</main>

<Toast />

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .detail-overlay {
    position: fixed;
    inset: 0;
    top: 64px;
    background: var(--bg-primary);
    z-index: 50;
    overflow-y: auto;
  }
</style>
