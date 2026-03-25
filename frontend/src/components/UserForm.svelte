<script>
  /**
   * UserForm — Create/Edit user modal
   * $props(): user (null for create), onSave callback, onCancel callback
   */
  let { user = null, onSave, onCancel } = $props();

  let username = $state(user?.username ?? '');
  let password = $state('');
  let role = $state(user?.role ?? 'user');
  let saving = $state(false);
  let errors = $state({});

  const isEditing = $derived(!!user);
  const title = $derived(isEditing ? 'Editar Usuario' : 'Nuevo Usuario');

  function validate() {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!isEditing && !password) newErrors.password = 'La contraseña es obligatoria';
    if (password && password.length < 3) newErrors.password = 'Mínimo 3 caracteres';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    saving = true;
    try {
      const data = { username: username.trim(), role };
      if (password) data.password = password;

      if (isEditing) {
        await onSave({ id: user._id, data });
      } else {
        await onSave({ data });
      }
    } finally {
      saving = false;
    }
  }
</script>

<div class="modal-backdrop" onclick={onCancel} role="dialog" aria-modal="true">
  <div class="modal-content" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <h2>{title}</h2>
      <button class="btn btn-icon btn-ghost" onclick={onCancel}>✕</button>
    </div>

    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="user-username">Nombre de usuario</label>
        <input
          id="user-username"
          type="text"
          class="form-input"
          class:error={errors.username}
          placeholder="usuario"
          bind:value={username}
        />
        {#if errors.username}<p class="form-error">{errors.username}</p>{/if}
      </div>

      <div class="form-group">
        <label for="user-password">
          {isEditing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        </label>
        <input
          id="user-password"
          type="password"
          class="form-input"
          class:error={errors.password}
          placeholder="••••••"
          bind:value={password}
        />
        {#if errors.password}<p class="form-error">{errors.password}</p>{/if}
      </div>

      <div class="form-group">
        <label for="user-role">Rol</label>
        <select id="user-role" class="form-input" bind:value={role}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" onclick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  </div>
</div>
