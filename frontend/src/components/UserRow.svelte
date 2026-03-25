<script>
  /**
   * UserRow — table row for a user in admin panel
   * $props(): user data and callback functions
   */
  let { user, onEdit, onDelete } = $props();
</script>

<tr>
  <td>
    <strong>{user.username}</strong>
  </td>
  <td>
    <span class="badge" class:badge-admin={user.role === 'admin'} class:badge-user={user.role === 'user'}>
      {user.role}
    </span>
  </td>
  <td>
    <code class="user-id">{user._id}</code>
  </td>
  <td class="actions-cell">
    <button class="btn btn-ghost btn-sm" onclick={() => onEdit(user)}>
      ✏️ Editar
    </button>
    <button class="btn btn-danger btn-sm" onclick={() => onDelete(user._id)}>
      🗑️
    </button>
  </td>
</tr>

<style>
  .user-id {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: var(--bg-input);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }

  .actions-cell {
    display: flex;
    gap: 0.35rem;
  }
</style>
