<script>
  /**
   * ProductForm — Create/Edit product modal
   * $props(): product (null for create), onSave callback, onCancel callback
   */
  let { product = null, onSave, onCancel } = $props();

  // $state() — form fields
  let nombre = $state(product?.nombre ?? '');
  let precio = $state(product?.precio ?? '');
  let imagenFile = $state(null);
  let saving = $state(false);

  // $state() — validation errors
  let errors = $state({});

  // $derived() — whether we're editing
  const isEditing = $derived(!!product);
  const title = $derived(isEditing ? 'Editar Producto' : 'Nuevo Producto');

  function validate() {
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      newErrors.precio = 'Introduce un precio válido mayor que 0';
    }
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    saving = true;
    try {
      if (isEditing) {
        // Update: send JSON
        await onSave({
          id: product._id,
          data: { nombre: nombre.trim(), precio: Number(precio) }
        });
      } else {
        // Create: send FormData (supports image upload)
        const formData = new FormData();
        formData.append('nombre', nombre.trim());
        formData.append('precio', Number(precio));
        if (imagenFile) {
          formData.append('imagen', imagenFile);
        }
        await onSave({ formData });
      }
    } finally {
      saving = false;
    }
  }

  function handleFileChange(e) {
    imagenFile = e.target.files[0] || null;
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
        <label for="prod-nombre">Nombre</label>
        <input
          id="prod-nombre"
          type="text"
          class="form-input"
          class:error={errors.nombre}
          placeholder="Nombre del producto"
          bind:value={nombre}
        />
        {#if errors.nombre}<p class="form-error">{errors.nombre}</p>{/if}
      </div>

      <div class="form-group">
        <label for="prod-precio">Precio (€)</label>
        <input
          id="prod-precio"
          type="number"
          step="0.01"
          min="0"
          class="form-input"
          class:error={errors.precio}
          placeholder="0.00"
          bind:value={precio}
        />
        {#if errors.precio}<p class="form-error">{errors.precio}</p>{/if}
      </div>

      {#if !isEditing}
        <div class="form-group">
          <label for="prod-imagen">Imagen</label>
          <input
            id="prod-imagen"
            type="file"
            class="form-input"
            accept="image/*"
            onchange={handleFileChange}
          />
        </div>
      {/if}

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
