<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';
  import { register } from '../services/auth.service.js';

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
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
    if (username.trim().length < 3) newErrors.username = 'Mínimo 3 caracteres';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (password.length < 3) newErrors.password = 'Mínimo 3 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validate()) return;

    loading = true;
    try {
      await register(username.trim(), password);
      toastStore.success('¡Cuenta creada! Ahora puedes iniciar sesión.');
      routerStore.navigate('/login');
    } catch (err) {
      toastStore.error(err.message || 'Error al registrar');
    } finally {
      loading = false;
    }
  }
</script>

<div class="register-page">
  <div class="register-card">
    <div class="register-header">
      <span class="register-icon">🚀</span>
      <h1>Crear Cuenta</h1>
      <p>Regístrate para empezar</p>
    </div>

    <form onsubmit={handleRegister}>
      <div class="form-group">
        <label for="reg-username">Usuario</label>
        <input
          id="reg-username"
          type="text"
          class="form-input"
          class:error={errors.username}
          placeholder="Elige un nombre de usuario"
          bind:value={username}
          disabled={loading}
          autocomplete="username"
        />
        {#if errors.username}<p class="form-error">{errors.username}</p>{/if}
      </div>

      <div class="form-group">
        <label for="reg-password">Contraseña</label>
        <input
          id="reg-password"
          type="password"
          class="form-input"
          class:error={errors.password}
          placeholder="Tu contraseña"
          bind:value={password}
          disabled={loading}
          autocomplete="new-password"
        />
        {#if errors.password}<p class="form-error">{errors.password}</p>{/if}
      </div>

      <div class="form-group">
        <label for="reg-confirm">Confirmar Contraseña</label>
        <input
          id="reg-confirm"
          type="password"
          class="form-input"
          class:error={errors.confirmPassword}
          placeholder="Repite tu contraseña"
          bind:value={confirmPassword}
          disabled={loading}
          autocomplete="new-password"
        />
        {#if errors.confirmPassword}<p class="form-error">{errors.confirmPassword}</p>{/if}
      </div>

      <button type="submit" class="btn btn-primary btn-lg register-btn" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>

    <p class="register-footer">
      ¿Ya tienes cuenta?
      <a href="#/login">Inicia sesión</a>
    </p>
  </div>
</div>

<style>
  .register-page {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    min-height: calc(100vh - 64px);
  }

  .register-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
    animation: slideUp var(--transition-normal);
  }

  .register-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .register-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }

  .register-header h1 {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--text-primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
  }

  .register-header p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .register-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .register-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
