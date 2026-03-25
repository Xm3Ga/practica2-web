# Práctica 2: Frontend en Svelte 5 + API REST

Este repositorio contiene la entrega completa de la Práctica 2.

---

## Cómo desplegar

Para ejecutar este proyecto en otro equipo tras clonar el repositorio, **únicamente necesitas Docker y Docker Compose**.

### Paso 1: Levantar todos los servicios
El proyecto incluye un `docker-compose.yml` que orquesta 4 contenedores: Base de datos (MongoDB), Caché (Redis), API Backend (Node) y Frontend Svelte (Nginx).

Desde la raíz del proyecto, ejecuta:
```bash
docker-compose up --build
```

### Paso 2: Acceder a la aplicación
Una vez los 4 contenedores estén en estado `Running`, abre tu navegador en:
👉 **[http://localhost:8080](http://localhost:8080)**

### Usuarios predeterminados útiles para pruebas
El backend incluye un script `seed.js` que se ejecuta al arrancar el contenedor e inserta estos dos usuarios por defecto:

| Usuario | Contraseña | Rol | Acceso |
|---------|-----------|-----|--------|
| `admin` | `admin123` | **admin** | Total (CRUD de usuarios y productos) |
| `user`  | `user123`  | **user**  | Lectura de productos y edición propia |


