# ProductosPro — Frontend Svelte 5

Frontend SPA construido con **Svelte 5 + Vite** que consume una API REST con autenticación JWT y roles (admin/user).

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Arrancar el backend (desde la raíz del proyecto)
docker-compose up

# 3. Arrancar el frontend (en otra terminal)
cd frontend
npm run dev
```

El frontend se ejecuta en `http://localhost:5173` y hace proxy a `http://localhost:3000/api`.

### Usuarios de prueba
| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | admin |
| user | user123 | user |

## 📁 Estructura del proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.svelte          # Barra de navegación
│   │   ├── ProductCard.svelte     # Tarjeta de producto
│   │   ├── ProductForm.svelte     # Modal crear/editar producto
│   │   ├── UserRow.svelte         # Fila de usuario en tabla admin
│   │   ├── UserForm.svelte        # Modal crear/editar usuario
│   │   ├── Toast.svelte           # Notificaciones toast
│   │   ├── ConfirmModal.svelte    # Modal de confirmación
│   │   └── Spinner.svelte         # Indicador de carga
│   ├── pages/              # Páginas de la aplicación
│   │   ├── LoginPage.svelte       # Inicio de sesión
│   │   ├── RegisterPage.svelte    # Registro
│   │   ├── ProductsPage.svelte    # Listado de productos
│   │   ├── ProductDetailPage.svelte # Detalle de producto
│   │   ├── ProfilePage.svelte     # Perfil de usuario
│   │   └── AdminUsersPage.svelte  # Gestión de usuarios (admin)
│   ├── services/           # Comunicación con la API
│   │   ├── api.js                 # Fetch wrapper con JWT
│   │   ├── auth.service.js        # Login/Register
│   │   ├── product.service.js     # CRUD productos
│   │   └── user.service.js        # CRUD usuarios
│   ├── stores/             # Estado global (Svelte 5 Runes)
│   │   ├── auth.store.svelte.js   # Estado de autenticación
│   │   ├── toast.store.svelte.js  # Notificaciones
│   │   └── router.store.svelte.js # Navegación SPA
│   ├── App.svelte          # Componente raíz + router
│   ├── app.css             # Sistema de diseño CSS
│   └── main.js             # Punto de entrada
```

## ⚡ Runas de Svelte 5 utilizadas

### `$state()` — Estado reactivo
| Componente/Store | Variables | Propósito |
|---|---|---|
| `auth.store.svelte.js` | `token`, `user` | Token JWT y datos del usuario (inicializados desde localStorage) |
| `toast.store.svelte.js` | `toasts` | Array de notificaciones activas |
| `router.store.svelte.js` | `currentRoute`, `routeParam` | Ruta actual y parámetros |
| `ProductsPage.svelte` | `products`, `loading`, `searchQuery` | Lista de productos, estado de carga y búsqueda |
| `AdminUsersPage.svelte` | `users`, `loading`, `showForm` | Lista de usuarios y estado de modales |
| `ProductForm.svelte` | `nombre`, `precio`, `errors`, `saving` | Campos del formulario y validación |
| `UserForm.svelte` | `username`, `password`, `role`, `errors` | Campos del formulario y validación |

### `$derived()` — Valores derivados
| Componente/Store | Variable | Cálculo |
|---|---|---|
| `auth.store.svelte.js` | `isAuthenticated`, `isAdmin`, `displayName` | Derivados del token/user |
| `ProductsPage.svelte` | `filteredProducts`, `productCount`, `totalCount` | Productos filtrados por búsqueda |
| `AdminUsersPage.svelte` | `totalUsers`, `adminCount` | Contadores de usuarios |
| `ProductCard.svelte` | `formattedPrice`, `imageUrl` | Precio formateado y URL de imagen |
| `ProductDetailPage.svelte` | `productId`, `formattedPrice` | ID desde ruta, precio formateado |
| `ProductForm.svelte` | `isEditing`, `title` | Modo edición y título del modal |
| `App.svelte` | `currentPage` | Página activa según la ruta |

### `$effect()` — Efectos secundarios
| Componente/Store | Efecto |
|---|---|
| `auth.store.svelte.js` | Persistir token a localStorage cuando cambia |
| `router.store.svelte.js` | Escuchar evento `hashchange` del navegador |
| `App.svelte` | Redirigir al login si se borra el token |
| `LoginPage.svelte` | Redirigir a productos si ya está autenticado |
| `RegisterPage.svelte` | Redirigir a productos si ya está autenticado |
| `ProductsPage.svelte` | Cargar productos al montar el componente |
| `ProductDetailPage.svelte` | Cargar producto cuando cambia el ID de la ruta |
| `AdminUsersPage.svelte` | Verificar rol admin y cargar usuarios |

### `$props()` — Props de componentes
| Componente | Props | Callbacks |
|---|---|---|
| `ProductCard.svelte` | `product`, `isAdmin` | `onView()`, `onEdit()`, `onDelete()` |
| `ProductForm.svelte` | `product?` | `onSave()`, `onCancel()` |
| `UserRow.svelte` | `user` | `onEdit()`, `onDelete()` |
| `UserForm.svelte` | `user?` | `onSave()`, `onCancel()` |
| `ConfirmModal.svelte` | `message` | `onConfirm()`, `onCancel()` |
| `Spinner.svelte` | `message` | — |

## 🔗 Endpoints del backend utilizados

| Endpoint | Método | Uso |
|---|---|---|
| `POST /api/login` | POST | Iniciar sesión (devuelve JWT) |
| `POST /api/register` | POST | Registrar nuevo usuario |
| `GET /api/productos` | GET | Listar todos los productos |
| `POST /api/productos` | POST | Crear producto (admin, multipart) |
| `PUT /api/productos/:id` | PUT | Actualizar producto (admin) |
| `DELETE /api/productos/:id` | DELETE | Eliminar producto (admin) |
| `GET /api/users` | GET | Listar usuarios (admin) |
| `POST /api/users` | POST | Crear usuario (admin) |
| `PUT /api/users/:id` | PUT | Actualizar usuario (admin) |
| `DELETE /api/users/:id` | DELETE | Eliminar usuario (admin) |

## 🎨 Características

- **Dark theme** con CSS custom properties
- **Diseño responsive** (mobile-first)
- **Navegación SPA** hash-based (sin dependencias externas)
- **Autenticación JWT** con persistencia en localStorage
- **Control de roles** (admin/user) en UI
- **Toasts** para feedback de acciones
- **Modales de confirmación** para acciones destructivas
- **Validación de formularios** en cliente
- **Spinners de carga** en operaciones asíncronas
- **Búsqueda dinámica** de productos con `$derived()`
