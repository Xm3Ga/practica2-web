<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';

  // $derived() — check if link is active
  const isActive = (path) => routerStore.route === path;
</script>

<nav class="navbar">
  <div class="navbar-inner">
    <a href="#/" class="navbar-brand" onclick={(e) => { e.preventDefault(); routerStore.navigate('/'); }}>
      <span class="brand-icon">⚡</span>
      <span class="brand-text">ProductosPro</span>
    </a>

    {#if authStore.isAuthenticated}
      <div class="navbar-links">
        <a
          href="#/productos"
          class="nav-link"
          class:active={isActive('/productos') || isActive('/')}
        >
          <span class="nav-icon">📦</span>
          <span>Productos</span>
        </a>

        {#if authStore.isAdmin}
          <a
            href="#/admin/usuarios"
            class="nav-link"
            class:active={isActive('/admin')}
          >
            <span class="nav-icon">👥</span>
            <span>Usuarios</span>
          </a>
        {/if}

        <a
          href="#/perfil"
          class="nav-link"
          class:active={isActive('/perfil')}
        >
          <span class="nav-icon">👤</span>
          <span>Perfil</span>
        </a>
      </div>

      <div class="navbar-user">
        <span class="user-greeting">
          Hola, <strong>{authStore.displayName}</strong>
        </span>
        {#if authStore.isAdmin}
          <span class="badge badge-admin">Admin</span>
        {/if}
        <button class="btn btn-ghost btn-sm" onclick={() => { authStore.clearAuth(); routerStore.navigate('/login'); }}>
          Cerrar sesión
        </button>
      </div>
    {:else}
      <div class="navbar-links">
        <a
          href="#/login"
          class="nav-link"
          class:active={isActive('/login')}
        >
          Iniciar sesión
        </a>
        <a
          href="#/register"
          class="nav-link"
          class:active={isActive('/register')}
        >
          Registrarse
        </a>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 800;
    font-size: 1.15rem;
    color: var(--text-primary);
    text-decoration: none;
    flex-shrink: 0;
  }

  .brand-icon {
    font-size: 1.3rem;
  }

  .brand-text {
    background: linear-gradient(135deg, var(--text-primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-card);
  }

  .nav-link.active {
    color: var(--accent);
    background: var(--accent-glow);
    font-weight: 600;
  }

  .nav-icon {
    font-size: 1rem;
  }

  .navbar-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .user-greeting {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .navbar-inner {
      padding: 0 1rem;
      gap: 0.75rem;
      height: auto;
      min-height: 56px;
      flex-wrap: wrap;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .navbar-links {
      order: 3;
      width: 100%;
      justify-content: center;
      gap: 0.15rem;
    }

    .nav-link span:not(.nav-icon) {
      font-size: 0.8rem;
    }

    .user-greeting {
      display: none;
    }

    .badge {
      display: none;
    }
  }
</style>
