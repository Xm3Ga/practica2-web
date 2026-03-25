<script>
  import { routerStore } from '../stores/router.store.svelte.js';
  import { authStore } from '../stores/auth.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';
  import { getProducts } from '../services/product.service.js';
  import Spinner from '../components/Spinner.svelte';

  // $state()
  let product = $state(null);
  let loading = $state(true);
  let error = $state('');

  // $derived() — product ID from route param
  const productId = $derived(routerStore.param);

  // $derived() — formatted price
  const formattedPrice = $derived(
    product ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.precio) : ''
  );

  // $derived() — image URL
  const imageUrl = $derived(
    product?.imagen ? `/uploads/${product.imagen}` : null
  );

  // $effect() — load product when ID changes
  $effect(() => {
    if (productId) {
      loadProduct(productId);
    }
  });

  async function loadProduct(id) {
    loading = true;
    error = '';
    try {
      const products = await getProducts();
      const found = products.find(p => p._id === id);
      if (found) {
        product = found;
      } else {
        error = 'Producto no encontrado';
      }
    } catch (err) {
      error = err.message || 'Error al cargar el producto';
      toastStore.error(error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="page-container fade-in">
  <button class="btn btn-ghost back-btn" onclick={() => routerStore.navigate('/productos')}>
    ← Volver a productos
  </button>

  {#if loading}
    <Spinner message="Cargando producto..." />
  {:else if error}
    <div class="empty-state">
      <div class="empty-icon">❌</div>
      <h3>{error}</h3>
      <p>
        <a href="#/productos">Volver al listado</a>
      </p>
    </div>
  {:else if product}
    <div class="product-detail">
      <div class="detail-image">
        {#if imageUrl}
          <img src={imageUrl} alt={product.nombre} />
        {:else}
          <div class="detail-image-placeholder">📦</div>
        {/if}
      </div>
      <div class="detail-info">
        <h1 class="detail-name">{product.nombre}</h1>

        <div class="detail-price">{formattedPrice}</div>

        <div class="detail-meta">
          <div class="meta-item">
            <span class="meta-label">ID</span>
            <code class="meta-value">{product._id}</code>
          </div>
        </div>

        {#if authStore.isAdmin}
          <div class="detail-admin-note">
            <span class="badge badge-admin">Admin</span>
            <span>Puedes editar este producto desde el listado</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .back-btn {
    margin-bottom: 1.5rem;
  }

  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    animation: slideUp var(--transition-normal);
  }

  .detail-image {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--bg-card);
    border: 1px solid var(--border);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-image-placeholder {
    font-size: 5rem;
    opacity: 0.3;
  }

  .detail-info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .detail-name {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .detail-price {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--success);
  }

  .detail-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    background: var(--bg-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .meta-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    min-width: 80px;
  }

  .meta-value {
    font-size: 0.85rem;
    color: var(--text-secondary);
    background: var(--bg-input);
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
  }

  .detail-admin-note {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: var(--accent-glow);
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .product-detail {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .detail-name {
      font-size: 1.5rem;
    }

    .detail-price {
      font-size: 1.75rem;
    }
  }
</style>
