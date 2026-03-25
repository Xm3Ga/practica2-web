<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';

  function handleLogout() {
    authStore.clearAuth();
    toastStore.info('Sesión cerrada');
    routerStore.navigate('/login');
  }
</script>

<div class="page-container fade-in">
  <div class="page-header">
    <h1>👤 Mi Perfil</h1>
    <p>Información de tu cuenta</p>
  </div>

  <div class="profile-card">
    <div class="profile-avatar">
      {authStore.displayName[0]?.toUpperCase() ?? '?'}
    </div>

    <div class="profile-info">
      <div class="profile-field">
        <span class="field-label">Usuario</span>
        <span class="field-value">{authStore.displayName}</span>
      </div>

      <div class="profile-field">
        <span class="field-label">Rol</span>
        <span class="badge" class:badge-admin={authStore.isAdmin} class:badge-user={!authStore.isAdmin}>
          {authStore.user?.role ?? 'desconocido'}
        </span>
      </div>

      <div class="profile-field">
        <span class="field-label">ID</span>
        <code class="field-code">{authStore.user?.id ?? '—'}</code>
      </div>

      <div class="profile-field">
        <span class="field-label">Sesión</span>
        <span class="badge badge-active">Activa</span>
      </div>
    </div>

    <button class="btn btn-danger btn-lg logout-btn" onclick={handleLogout}>
      🚪 Cerrar Sesión
    </button>
  </div>
</div>

<style>
  .profile-card {
    max-width: 500px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    animation: slideUp var(--transition-normal);
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    box-shadow: var(--shadow-glow);
  }

  .profile-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .profile-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    background: var(--bg-card);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }

  .field-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .field-value {
    font-weight: 600;
  }

  .field-code {
    font-size: 0.8rem;
    color: var(--text-secondary);
    background: var(--bg-input);
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
  }

  .logout-btn {
    width: 100%;
  }
</style>
