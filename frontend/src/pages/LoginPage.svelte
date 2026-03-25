<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';
  import { login } from '../services/auth.service.js';

  let username = $state('');
  let password = $state('');
  let loading = $state(false);
  let errors = $state({});

  // $effect() — redirect if already authenticated
  $effect(() => {
    if (authStore.isAuthenticated) {
      routerStore.navigate('/productos');
    }
  });

  function validate() {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'El usuario es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!validate()) return;

    loading = true;
    try {
      const result = await login(username.trim(), password);
      authStore.setAuth(result.token);
      toastStore.success('¡Bienvenido de nuevo!');
      routerStore.navigate('/productos');
    } catch (err) {
      toastStore.error(err.message || 'Credenciales inválidas');
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <span class="login-icon">⚡</span>
      <h1>ProductosPro</h1>
      <p>Inicia sesión para continuar</p>
    </div>

    <form onsubmit={handleLogin}>
      <div class="form-group">
        <label for="login-username">Usuario</label>
        <input
          id="login-username"
          type="text"
          class="form-input"
          class:error={errors.username}
          placeholder="Tu nombre de usuario"
          bind:value={username}
          disabled={loading}
          autocomplete="username"
        />
        {#if errors.username}<p class="form-error">{errors.username}</p>{/if}
      </div>

      <div class="form-group">
        <label for="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          class="form-input"
          class:error={errors.password}
          placeholder="Tu contraseña"
          bind:value={password}
          disabled={loading}
          autocomplete="current-password"
        />
        {#if errors.password}<p class="form-error">{errors.password}</p>{/if}
      </div>

      <button type="submit" class="btn btn-primary btn-lg login-btn" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>

    <p class="login-footer">
      ¿No tienes cuenta?
      <a href="#/register">Regístrate aquí</a>
    </p>
  </div>
</div>

<style>
  .login-page {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    min-height: calc(100vh - 64px);
  }

  .login-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
    animation: slideUp var(--transition-normal);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }

  .login-header h1 {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--text-primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
  }

  .login-header p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .login-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .login-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
