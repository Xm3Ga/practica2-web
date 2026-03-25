<script>
  import { authStore } from '../stores/auth.store.svelte.js';
  import { routerStore } from '../stores/router.store.svelte.js';
  import { toastStore } from '../stores/toast.store.svelte.js';
  import { getUsers, createUser, updateUser, deleteUser } from '../services/user.service.js';
  import UserRow from '../components/UserRow.svelte';
  import UserForm from '../components/UserForm.svelte';
  import ConfirmModal from '../components/ConfirmModal.svelte';
  import Spinner from '../components/Spinner.svelte';

  let users = $state([]);
  let loading = $state(true);
  let showForm = $state(false);
  let editingUser = $state(null);
  let confirmDelete = $state(null);

  // $derived() — counts
  const totalUsers = $derived(users.length);
  const adminCount = $derived(users.filter(u => u.role === 'admin').length);

  // $effect() — redirect non-admins and load users
  $effect(() => {
    if (!authStore.isAdmin) {
      toastStore.warning('Acceso denegado: solo administradores');
      routerStore.navigate('/productos');
      return;
    }
    loadUsers();
  });

  async function loadUsers() {
    loading = true;
    try {
      users = await getUsers();
    } catch (err) {
      toastStore.error('Error al cargar usuarios: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function handleCreate() {
    editingUser = null;
    showForm = true;
  }

  function handleEdit(user) {
    editingUser = user;
    showForm = true;
  }

  async function handleSave(payload) {
    try {
      if (payload.id) {
        await updateUser(payload.id, payload.data);
        toastStore.success('Usuario actualizado');
      } else {
        await createUser(payload.data);
        toastStore.success('Usuario creado');
      }
      showForm = false;
      editingUser = null;
      await loadUsers();
    } catch (err) {
      toastStore.error(err.message || 'Error al guardar usuario');
    }
  }

  function handleDeleteRequest(id) {
    // Don't allow self-deletion
    if (id === authStore.user?.id) {
      toastStore.warning('No puedes eliminarte a ti mismo');
      return;
    }
    confirmDelete = id;
  }

  async function handleDeleteConfirm() {
    const id = confirmDelete;
    confirmDelete = null;
    try {
      await deleteUser(id);
      toastStore.success('Usuario eliminado');
      await loadUsers();
    } catch (err) {
      toastStore.error(err.message || 'Error al eliminar usuario');
    }
  }
</script>

<div class="page-container fade-in">
  <div class="page-header">
    <h1>👥 Gestión de Usuarios</h1>
    <p>{totalUsers} usuario{totalUsers !== 1 ? 's' : ''} · {adminCount} admin{adminCount !== 1 ? 's' : ''}</p>
  </div>

  <div class="toolbar">
    <button class="btn btn-primary" onclick={handleCreate}>
      ➕ Nuevo Usuario
    </button>
  </div>

  {#if loading}
    <Spinner message="Cargando usuarios..." />
  {:else if users.length === 0}
    <div class="empty-state">
      <div class="empty-icon">👤</div>
      <h3>No hay usuarios</h3>
    </div>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user (user._id)}
            <UserRow
              {user}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showForm}
  <UserForm
    user={editingUser}
    onSave={handleSave}
    onCancel={() => { showForm = false; editingUser = null; }}
  />
{/if}

{#if confirmDelete}
  <ConfirmModal
    message="Esta acción eliminará el usuario permanentemente. ¿Deseas continuar?"
    onConfirm={handleDeleteConfirm}
    onCancel={() => { confirmDelete = null; }}
  />
{/if}
