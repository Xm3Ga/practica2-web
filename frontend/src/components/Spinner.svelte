<script>
  /** @type {{ message: string, type?: string }} */
  let { message = '', type = 'info' } = $props();
</script>

<div class="spinner-container">
  <div class="spinner"></div>
  {#if message}
    <p class="spinner-text">{message}</p>
  {/if}
</div>

<style>
  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .spinner-text {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
</style>
