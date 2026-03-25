<script>
  /**
   * ProductCard — uses $props() for product data and callback functions
   * @type {{
   *   product: { _id: string, nombre: string, precio: number, imagen?: string },
   *   isAdmin: boolean,
   *   onView: (id: string) => void,
   *   onEdit?: (product: any) => void,
   *   onDelete?: (id: string) => void
   * }}
   */
  let { product, isAdmin = false, onView, onEdit, onDelete } = $props();

  // $derived() — format price
  const formattedPrice = $derived(
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.precio)
  );

  // $derived() — image URL
  const imageUrl = $derived(
    product.imagen ? `/uploads/${product.imagen}` : null
  );
</script>

<div class="product-card card" role="article">
  <div class="product-image" onclick={() => onView(product._id)}>
    {#if imageUrl}
      <img src={imageUrl} alt={product.nombre} loading="lazy" />
    {:else}
      <div class="product-image-placeholder">📦</div>
    {/if}
  </div>

  <div class="product-body">
    <h3 class="product-name" onclick={() => onView(product._id)}>{product.nombre}</h3>
    <span class="product-price">{formattedPrice}</span>
  </div>

  <div class="product-actions">
    <button class="btn btn-ghost btn-sm" onclick={() => onView(product._id)}>
      👁️ Ver
    </button>
    {#if isAdmin}
      <button class="btn btn-ghost btn-sm" onclick={() => onEdit?.(product)}>
        ✏️ Editar
      </button>
      <button class="btn btn-danger btn-sm" onclick={() => onDelete?.(product._id)}>
        🗑️
      </button>
    {/if}
  </div>
</div>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
  }

  .product-image {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: var(--bg-input);
    cursor: pointer;
    position: relative;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }

  .product-card:hover .product-image img {
    transform: scale(1.05);
  }

  .product-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    opacity: 0.3;
  }

  .product-body {
    padding: 1rem 1.25rem;
    flex: 1;
  }

  .product-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
    cursor: pointer;
    transition: color var(--transition-fast);
  }

  .product-name:hover {
    color: var(--accent);
  }

  .product-price {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--success);
  }

  .product-actions {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
  }
</style>
