# Iatryon Web

Frontend web para **Iatryon**, un sistema de gestión médica desarrollado como SPA con **Vue 3 + TypeScript**.

El proyecto consume una API REST desarrollada con Node.js, Express y MongoDB, e implementa autenticación basada en sesiones, control de acceso por roles y gestión de pacientes.

## Tecnologías

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Fetch API
- HTML5
- CSS3

## Arquitectura

El frontend está organizado por responsabilidades:

```text
src/
├── components/
│   └── PatientForm.vue
├── layouts/
│   └── AppLayout.vue
├── router/
│   └── index.ts
├── services/
│   ├── auth.service.ts
│   └── patient.service.ts
├── stores/
│   └── auth.store.ts
├── types/
│   └── auth.ts
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── PatientsView.vue
│   └── UsersView.vue
├── App.vue
└── main.ts
```

### Responsabilidades principales

- **Views:** coordinan la lógica de cada pantalla.
- **Components:** contienen elementos reutilizables de interfaz.
- **Services:** centralizan las peticiones HTTP a la API.
- **Stores:** gestionan estado global mediante Pinia.
- **Router:** administra navegación, rutas protegidas y control de acceso por roles.
- **Layouts:** contienen elementos compartidos entre las vistas autenticadas.

## Funcionalidades implementadas

### Autenticación

El sistema utiliza sesiones almacenadas en el backend mediante cookies `HttpOnly`.

Flujo principal:

```text
Login
→ POST /api/auth/login
→ creación de sesión
→ cookie HttpOnly
→ GET /api/auth/me
→ recuperación del usuario
→ almacenamiento en Pinia
```

Se implementó restauración automática de sesión mediante:

```http
GET /api/auth/me
```

El store utiliza un flag `initialized` para distinguir entre:

```text
La sesión todavía no ha sido comprobada
```

y:

```text
La sesión ya fue comprobada y existe o no un usuario autenticado
```

Esto evita redirecciones prematuras mientras se consulta el backend.

### Control de acceso por roles

Roles disponibles:

```text
ADMIN
RECEPTIONIST
DOCTOR
```

Vue Router utiliza metadata para restringir rutas:

```ts
meta: {
  requiresAuth: true,
  roles: ['ADMIN']
}
```

Además, la interfaz oculta acciones que el usuario no tiene permitido realizar.

La seguridad definitiva permanece implementada en el backend mediante autorización por sesión y rol.

### Gestión de pacientes

Actualmente se encuentra implementado el CRUD completo de pacientes.

Incluye:

- consulta de pacientes;
- búsqueda por número de identificación;
- selección de filas;
- registro;
- edición;
- eliminación;
- estados de carga;
- estados vacíos;
- manejo de errores;
- actualización reactiva de la tabla;
- acciones visibles según rol.

Permisos actuales:

| Acción    | ADMIN | RECEPTIONIST | DOCTOR |
| --------- | ----- | ------------ | ------ |
| Consultar | Sí    | Sí           | Sí     |
| Crear     | Sí    | Sí           | No     |
| Editar    | Sí    | Sí           | No     |
| Eliminar  | Sí    | No           | No     |

El formulario de pacientes es reutilizable tanto para creación como para edición.

## Configuración

Crear un archivo `.env` en la raíz:

```env
VITE_API_URL=https://iatryon-api.onrender.com
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/jonathanAguirre1999/iatryon-med-software-web.git
cd iatryon-web
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

## Backend

La aplicación consume la API desplegada en:

```text
https://iatryon-api.onrender.com
```

Principales endpoints utilizados actualmente:

```http
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/patients
POST   /api/patients
PATCH  /api/patients/:id
DELETE /api/patients/:id
```

## Sesiones y CORS

Debido a que frontend y backend pueden ejecutarse desde dominios distintos, las peticiones autenticadas utilizan:

```ts
credentials: "include";
```

El backend debe permitir el origen del frontend utilizando CORS con credenciales.

En producción, la cookie de sesión se configura con:

```text
HttpOnly
Secure
SameSite=None
```

Durante las pruebas se detectó que algunos modos de privacidad del navegador pueden bloquear cookies de terceros, provocando que el login sea exitoso pero `/api/auth/me` responda como sesión inválida.

## Estado del proyecto

### Completado

- autenticación real contra API;
- restauración de sesión;
- logout;
- Vue Router;
- rutas protegidas;
- RBAC;
- layout autenticado;
- CRUD de pacientes;
- búsqueda de pacientes;
- manejo de estados de carga, éxito, vacío y error.

### Pendiente

- módulo de usuarios;
- módulo de citas;
- componentes visuales avanzados;
- diseño responsivo final;
- notificaciones tipo toast;
- PWA;
- Service Worker;
- caché offline limitado;
- mejoras de accesibilidad;
- pruebas automatizadas.

## Próximos pasos

El desarrollo continuará con:

```text
Usuarios
→ CRUD
→ permisos ADMIN

Citas
→ consulta
→ creación
→ edición
→ eliminación
→ validación de roles

Luego
→ estilos finales
→ componentes visuales
→ responsive
→ PWA
```

## Consideraciones de diseño

El frontend evita duplicar lógica entre componentes.

Por ejemplo:

```text
PatientForm
→ captura y valida datos

PatientsView
→ coordina creación o edición

patient.service
→ realiza peticiones HTTP

Backend
→ valida reglas de negocio
```

Las reglas críticas permanecen en el backend para evitar depender de validaciones del cliente.

## Autor

Proyecto desarrollado con fines académicos y de aprendizaje de arquitectura frontend moderna, integración con APIs REST y gestión de estado en aplicaciones SPA.
