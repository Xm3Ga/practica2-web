<script>
  import { toastStore } from '../stores/toast.store.svelte.js';
</script>

{#if toastStore.toasts.length > 0}
  <div class="toast-container" role="alert">
    {#each toastStore.toasts as toast (toast.id)}
      <div class="toast toast-{toast.type}" class:slide-in={true}>
        <span class="toast-icon">
          {#if toast.type === 'success'}✅
          {:else if toast.type === 'error'}❌
          {:else if toast.type === 'warning'}⚠️
          {:else}ℹ️
          {/if}
        </span>
        <span class="toast-message">{toast.message}</span>
        <button class="toast-close" onclick={() => toastStore.removeToast(toast.id)}>×</button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    top: 80px;
    right: 1.5rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
    width: 100%;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
    background: var(--bg-card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    animation: slideInRight var(--transition-normal);
    pointer-events: auto;
  }

  .toast-success {
    border-left: 3px solid var(--success);
  }

  .toast-error {
    border-left: 3px solid var(--danger);
  }

  .toast-warning {
    border-left: 3px solid var(--warning);
  }

  .toast-info {
    border-left: 3px solid var(--info);
  }

  .toast-icon {
    flex-shrink: 0;
    font-size: 1rem;
  }

  .toast-message {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 0.25rem;
    transition: color var(--transition-fast);
  }

  .toast-close:hover {
    color: var(--text-primary);
  }

  @media (max-width: 480px) {
    .toast-container {
      right: 0.75rem;
      left: 0.75rem;
      max-width: none;
    }
  }
</style>
