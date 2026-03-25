<script>
  /** @type {{ message: string, onConfirm: () => void, onCancel: () => void }} */
  let { message, onConfirm, onCancel } = $props();
</script>

<div class="modal-backdrop" onclick={onCancel} role="dialog" aria-modal="true">
  <div class="modal-content" onclick={(e) => e.stopPropagation()}>
    <div class="confirm-icon">⚠️</div>
    <h3 class="confirm-title">¿Estás seguro?</h3>
    <p class="confirm-message">{message}</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick={onCancel}>Cancelar</button>
      <button class="btn btn-danger" onclick={onConfirm}>Confirmar</button>
    </div>
  </div>
</div>

<style>
  .confirm-icon {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .confirm-title {
    text-align: center;
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .confirm-message {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }
</style>
