<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';
  import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/product.service.js';
  import ProductCard from '../components/ProductCard.svelte';
  import ProductForm from '../components/ProductForm.svelte';
  import ConfirmModal from '../components/ConfirmModal.svelte';
  import Spinner from '../components/Spinner.svelte';

  // $state() — products list and loading state
  let products = $state([]);
  let loading = $state(true);
  let searchQuery = $state('');

  // $state() — modals
  let showForm = $state(false);
  let editingProduct = $state(null);
  let confirmDelete = $state(null);

  // $derived() — filtered products based on search query
  const filteredProducts = $derived(
    searchQuery.trim()
      ? products.filter(p =>
          p.nombre.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
      : products
  );

  // $derived() — product count
  const productCount = $derived(filteredProducts.length);
  const totalCount = $derived(products.length);

  // $effect() — load products on mount
  $effect(() => {
    loadProducts();
  });

  async function loadProducts() {
    loading = true;
    try {
      products = await getProducts();
    } catch (err) {
      toastStore.error('Error al cargar productos: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function handleView(id) {
    routerStore.navigate(`/productos/${id}`);
  }

  function handleEdit(product) {
    editingProduct = product;
    showForm = true;
  }

  function handleCreate() {
    editingProduct = null;
    showForm = true;
  }

  async function handleSave(payload) {
    try {
      if (payload.formData) {
        // Create
        await createProduct(payload.formData);
        toastStore.success('Producto creado correctamente');
      } else {
        // Update
        await updateProduct(payload.id, payload.data);
        toastStore.success('Producto actualizado correctamente');
      }
      showForm = false;
      editingProduct = null;
      await loadProducts();
    } catch (err) {
      toastStore.error(err.message || 'Error al guardar producto');
    }
  }

  function handleDeleteRequest(id) {
    confirmDelete = id;
  }

  async function handleDeleteConfirm() {
    const id = confirmDelete;
    confirmDelete = null;
    try {
      await deleteProduct(id);
      toastStore.success('Producto eliminado');
      await loadProducts();
    } catch (err) {
      toastStore.error(err.message || 'Error al eliminar producto');
    }
  }
</script>

<div class="page-container fade-in">
  <div class="page-header">
    <h1>📦 Productos</h1>
    <p>
      {#if searchQuery.trim()}
        {productCount} resultado{productCount !== 1 ? 's' : ''} de {totalCount} productos
      {:else}
        {totalCount} producto{totalCount !== 1 ? 's' : ''} en total
      {/if}
    </p>
  </div>

  <div class="toolbar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="form-input"
        placeholder="Buscar productos por nombre..."
        bind:value={searchQuery}
        style="padding-left: 2.5rem;"
      />
    </div>

    {#if authStore.isAdmin}
      <button class="btn btn-primary" onclick={handleCreate}>
        ➕ Nuevo Producto
      </button>
    {/if}
  </div>

  {#if loading}
    <Spinner message="Cargando productos..." />
  {:else if filteredProducts.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No se encontraron productos</h3>
      <p>{searchQuery ? 'Prueba con otro término de búsqueda' : 'Aún no hay productos creados'}</p>
    </div>
  {:else}
    <div class="product-grid">
      {#each filteredProducts as product (product._id)}
        <ProductCard
          {product}
          isAdmin={authStore.isAdmin}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      {/each}
    </div>
  {/if}
</div>

{#if showForm}
  <ProductForm
    product={editingProduct}
    onSave={handleSave}
    onCancel={() => { showForm = false; editingProduct = null; }}
  />
{/if}

{#if confirmDelete}
  <ConfirmModal
    message="Esta acción eliminará el producto permanentemente. ¿Deseas continuar?"
    onConfirm={handleDeleteConfirm}
    onCancel={() => { confirmDelete = null; }}
  />
{/if}
