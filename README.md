# API de Gestión de Eventos

API REST construida con Node.js y Express, organizada en capas, como base para un sistema de gestión de eventos, entradas (tickets) y usuarios.

## Temática

Plataforma de gestión y venta de entradas para eventos (conciertos, charlas, conferencias, etc.). Permite administrar eventos, usuarios y las entradas asociadas a cada evento.

## Tecnologías

- Node.js
- Express 5
- MongoDB + Mongoose
- Passport.js (estrategias de autenticación: `passport-local`, `passport-jwt`)
- bcrypt (hash de contraseñas)
- jsonwebtoken (autenticación con JWT)
- cookie-parser (lectura de cookies)
- dotenv
- JavaScript ES Modules (import/export)

## Instalación

```bash
git clone https://github.com/IgnacioEscuti/Gestion-de-eventos.git
cd Gestion-de-eventos
npm install
```

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto a partir de `.env.example`:

```bash
cp .env.example .env
```

Variables necesarias:

| Variable | Descripción |
|---|---|
| PORT | Puerto en el que se levanta el servidor |
| NODE_ENV | Entorno de ejecución (development / production) |
| MONGO_URL | URL de conexión a la base de datos de MongoDB |
| JWT_SECRET | Clave secreta para la firma de tokens JWT |
| JWT_EXPIRES_IN | Duración del token JWT (ej. `1h`, `7d`) |

## Cómo ejecutar

Modo desarrollo (con recarga automática):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

## Estructura de carpetas

```
src/
  config/        # Configuración de entorno y conexión a la base de datos
  controllers/   # Lógica de manejo de las peticiones HTTP
  DAOs/          # Acceso a datos (Data Access Objects)
  middlewares/   # Middlewares de Express
  models/        # Esquemas de Mongoose
  repositories/  # Capa de abstracción entre servicios y DAO
  routes/        # Definición de rutas por recurso
  services/      # Lógica de negocio
  utils/         # Funciones utilitarias
  app.js         # Configuración de la aplicación Express
  server.js      # Punto de entrada, levanta el servidor
```

## Autenticación con Passport.js

La autenticación está centralizada en estrategias de [Passport.js](https://www.passportjs.org/), definidas en `src/config/passport.config.js` (Passport se inicializa en `app.js`, pero ninguna estrategia vive ahí). Esto deja el archivo preparado para agregar nuevas estrategias (por ejemplo Google o GitHub OAuth) sin tocar `app.js` ni las rutas existentes: solo hay que sumar el `passport.use("nombre", new Strategy(...))` correspondiente.

| Estrategia | Tipo | Qué hace |
|---|---|---|
| `register` | `passport-local` | Verifica que el email no esté registrado, hashea la contraseña con bcrypt y crea el usuario con `role: "user"` |
| `login` | `passport-local` | Busca el usuario por email y valida la contraseña con bcrypt |
| `current` | `passport-jwt` | Extrae el JWT de la cookie `currentUser` (extractor custom, no de un header) y valida su firma |

El JWT en sí (generación de token y seteo de la cookie `httpOnly`) lo maneja el controller después de una autenticación exitosa, no la estrategia — así la estrategia solo se ocupa de validar credenciales.

## Roles y autorización

### Roles

| Rol | Descripción |
|---|---|
| `user` | Rol por defecto. Puede consultar eventos publicados. |
| `organizer` | Puede crear eventos y modificar/cancelar los eventos de los que es dueño. |
| `admin` | Acceso total: puede modificar cualquier evento y ver la lista de usuarios. |

Todo registro público (`POST /api/sessions/register`) crea el usuario con `role: "user"`, sin importar lo que se envíe en el body — no se puede auto-asignar `organizer` ni `admin` desde afuera.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

### Middlewares

Los middlewares de autenticación y autorización están separados del código de rutas y son reutilizables en cualquier endpoint:

| Middleware | Archivo | Qué hace |
|---|---|---|
| `authenticateCurrent` | `src/middlewares/auth.middlewares.js` | Lee el JWT de la cookie `currentUser` (vía la estrategia `current` de Passport), lo valida y puebla `req.user`. Si no hay cookie o el token es inválido/expirado, responde **401**. |
| `authorizeRoles(roles)` | `src/middlewares/authorize.middleware.js` | Middleware factory: recibe un array de roles permitidos y lo compara contra `req.user.role`. Si el rol no está en la lista, responde **403**. Siempre se usa después de `authenticateCurrent`. |

Ejemplo de uso combinado en una ruta (`src/routes/event.routes.js`):

```js
router.post("/", authenticateCurrent, authorizeRoles(["admin", "organizer"]), createEvent);
```

Para el caso de "modificar solo eventos propios", el rol ya no alcanza para decidir el acceso (depende de a quién pertenece el evento), así que esa validación vive en la capa de servicio (`event.service.js`), que compara el `organizer` del evento contra el usuario autenticado y deja pasar también a los `admin`.

### 401 vs 403

| Código | Cuándo se usa | Quién lo devuelve |
|---|---|---|
| **401 Unauthorized** | No hay sesión válida: falta la cookie, o el token es inválido/expiró. | `authenticateCurrent` |
| **403 Forbidden** | Hay sesión válida, pero el rol (o la propiedad del recurso) no habilita la acción. | `authorizeRoles`, o la capa de servicio en el caso de propiedad de recursos |

## Rutas disponibles

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | /api/health | Indica que el servidor está activo | Público |
| GET | /api/events | Lista de eventos, con filtros, paginación y ordenamiento | Público |
| GET | /api/events/:id | Devuelve un evento por id | Público |
| POST | /api/events | Crea un evento | `organizer`, `admin` |
| PUT | /api/events/:id | Modifica los datos de un evento (propio, o cualquiera si es `admin`) | `organizer` dueño del evento, `admin` |
| PATCH | /api/events/:id/status | Cambia el estado de un evento (propio, o cualquiera si es `admin`) | `organizer` dueño del evento, `admin` |
| POST | /api/sessions/register | Registra un nuevo usuario (ver detalle abajo) | Público |
| POST | /api/sessions/login | Login: valida credenciales y guarda el JWT en una cookie | Público |
| GET | /api/sessions/current | Devuelve los datos del usuario autenticado (requiere cookie) | Autenticado |
| POST | /api/sessions/logout | Cierra sesión y elimina la cookie de autenticación | Público |
| GET | /api/users | Devuelve la lista de usuarios | `admin` |
| GET | /api/tickets | Devuelve la lista de tickets | Sin protección (fuera del alcance de esta entrega) |

## Registro de usuarios — POST /api/sessions/register

### Campos esperados (body JSON)

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| first_name | string | Sí | No puede estar vacío |
| last_name | string | Sí | No puede estar vacío |
| email | string | Sí | Formato de email válido; se normaliza (trim + lowercase) antes de guardar; debe ser único |
| password | string | Sí | Mínimo 5 caracteres, al menos una mayúscula |

El campo `role` no se acepta desde el body: todo registro público se crea con `role: "user"`, sin importar lo que se envíe.

### Ejemplo de request

```bash
curl -X POST http://localhost:3000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@example.com",
    "password": "Abc123"
  }'
```

### Respuesta exitosa (201)

```json
{
  "newUser": {
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@example.com",
    "role": "user"
  }
}
```

La contraseña nunca se devuelve en la respuesta. En la base de datos se guarda hasheada con bcrypt, nunca en texto plano.

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | Falta `first_name`, `last_name` o `email` | `{"error": "Faltan campos por completar"}` |
| 400 | `email` con formato inválido | `{"error": "El email debe cumplir con el formato"}` |
| 400 | `password` inválida (menos de 5 caracteres o sin mayúscula) | `{"error": "la contraseña debe tener minimo 5 caracteres"}` |
| 409 | El email ya está registrado | `{"error": "el usuario ya existe"}` |

## Login — POST /api/sessions/login

### Campos esperados (body JSON)

| Campo | Tipo | Requerido |
|---|---|---|
| email | string | Sí |
| password | string | Sí |

### Ejemplo de request

```bash
curl -X POST http://localhost:3000/api/sessions/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "ana@example.com",
    "password": "Abc123"
  }'
```

### Respuesta exitosa (200)

```json
{
  "email": "ana@example.com",
  "role": "user"
}
```

El JWT se guarda automáticamente en una cookie `currentUser` con `HttpOnly: true`. No se devuelve en el body.

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | Falta `email` o `password` | `{"error": "Faltan credenciales"}` |
| 401 | Email o contraseña incorrectos | `{"error": "Credenciales inválidas"}` |

> El mensaje de error no especifica cuál de los dos campos falló.

## Ruta protegida — GET /api/sessions/current

Requiere estar autenticado. La estrategia `current` de Passport lee la cookie `currentUser`, verifica el JWT y deja el payload disponible en `req.user`, que el controller devuelve en la respuesta.

### Ejemplo de request

```bash
curl http://localhost:3000/api/sessions/current \
  -b cookies.txt
```

### Respuesta exitosa (200)

```json
{
  "id": "6a456a217f4b329b77485800",
  "email": "ana@example.com",
  "role": "user"
}
```

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 401 | No hay cookie de sesión | `{"error": "no autenticado"}` |
| 401 | Token inválido, manipulado o expirado | `{"error": "no autenticado"}` |

## Logout — POST /api/sessions/logout

Elimina la cookie `currentUser` del cliente.

### Ejemplo de request

```bash
curl -X POST http://localhost:3000/api/sessions/logout \
  -b cookies.txt
```

### Respuesta exitosa (200)

```json
{
  "mensaje": "sesion cerrada"
}
```

Después del logout, cualquier request a `/api/sessions/current` devuelve `401`.

## Modelo de datos — Event

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| title | string | Sí | |
| description | string | Sí | |
| category | string | Sí | |
| date | Date | Sí | Debe ser una fecha futura al crear |
| location | string | Sí | |
| capacity | number | Sí | Debe ser mayor a 0 |
| price | number | Sí | No puede ser negativo |
| status | string | Sí | Uno de: `draft`, `published`, `cancelled`, `finished` |
| organizer | ObjectId (ref `user`) | Sí | Se asigna automáticamente desde el usuario autenticado; nunca se toma del body |

Un job de cron (`src/config/cron.config.js`) corre cada hora y pasa a `finished` los eventos `published` cuya fecha ya pasó.

## Crear evento — POST /api/events

Requiere cookie de sesión válida y rol `organizer` o `admin`. El `organizer` del evento se asigna automáticamente desde `req.user`; si el body incluye un campo `organizer`, se ignora.

### Validaciones de negocio (en `event.service.js`)

- La fecha no puede ser pasada.
- `capacity` debe ser mayor a 0.
- `price` no puede ser negativo.

### Ejemplo de request

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Congreso Tech 2026",
    "description": "Charlas sobre desarrollo web",
    "category": "tech",
    "date": "2026-08-01",
    "location": "CABA",
    "price": 100,
    "capacity": 50,
    "status": "draft"
  }'
```

### Respuesta exitosa (200)

```json
{ "event": { "_id": "...", "title": "Congreso Tech 2026", "status": "draft", "organizer": "...", "...": "..." } }
```

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | Fecha pasada, inválida, `capacity <= 0` o `price < 0` | `{"error": "la fecha del evento debe ser futura"}` |
| 401 | No hay cookie de sesión, o el token es inválido/expiró | `{"error": "no autenticado"}` |
| 403 | Usuario autenticado con rol `user` (sin permiso para crear eventos) | `{"status":"error","message":"Usuario no autorizado"}` |

## Consultar evento por id — GET /api/events/:id

Público, no requiere autenticación.

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | El `id` no tiene formato de ObjectId válido | `{"error": "id de evento inválido"}` |
| 404 | El evento no existe | `{"error": "no existe el evento"}` |

## Modificar evento — PUT /api/events/:id

Requiere cookie de sesión válida y rol `organizer` o `admin`. Si el rol es `organizer`, el evento tiene que ser propio: se compara el `organizer` guardado en el evento contra el `id` del usuario autenticado. Un `admin` puede modificar cualquier evento.

Solo se pueden actualizar `title`, `description`, `category`, `location`, `date`, `capacity` y `price`. Si el body incluye `organizer` o `status`, se ignoran — el dueño del evento no se puede reasignar por este endpoint, y el cambio de estado tiene su propia ruta (`PATCH /api/events/:id/status`).

### Reglas de negocio

- No se puede modificar un evento con `status: "cancelled"`.
- No se puede modificar un evento cuya fecha ya pasó.
- Si se manda `date`, tiene que ser una fecha futura.
- `capacity` (si se manda) debe ser mayor a 0; `price` (si se manda) no puede ser negativo.

> **Decisión de diseño:** la consigna menciona que los eventos cancelados "no pueden modificarse (salvo justificación documentada)". No se implementó ninguna excepción para ese caso: no hay ningún caso de prueba que la ejercite ni una especificación de cómo debería funcionar (¿un campo de motivo? ¿solo lo puede hacer un admin?), así que se optó por el bloqueo total, que sí está cubierto por los casos de prueba.

### Ejemplo de request

```bash
curl -X PUT http://localhost:3000/api/events/<id> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{ "capacity": 80, "price": 120 }'
```

### Respuesta exitosa (200)

```json
{ "event": { "_id": "...", "title": "Congreso Tech 2026", "capacity": 80, "price": 120, "organizer": "...", "...": "..." } }
```

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | Evento cancelado, fecha ya pasada, `capacity <= 0`, `price < 0` o fecha nueva inválida/pasada | `{"error": "no se puede modificar un evento cancelado"}` |
| 401 | No hay cookie de sesión, o el token es inválido/expiró | `{"error": "no autenticado"}` |
| 403 | Rol `user` (sin permiso para modificar eventos) | `{"status":"error","message":"Usuario no autorizado"}` |
| 403 | Rol `organizer` que no es dueño del evento | `{"error": "no tenes permiso para modificar el evento"}` |
| 404 | El evento no existe | `{"error": "no existe el evento"}` |

## Cambiar estado del evento — PATCH /api/events/:id/status

Requiere cookie de sesión válida y rol `organizer` o `admin`. Mismas reglas de propiedad que `PUT /api/events/:id`. El body solo admite `status`.

### Reglas de negocio

- `status` tiene que ser uno de `draft`, `published`, `cancelled`, `finished`.
- No se puede cambiar el estado de un evento ya `cancelled` (cancelar es definitivo).
- No se puede pasar a `published` un evento `finished`, `cancelled`, o cuya fecha ya pasó.
- Cancelar un evento (`status: "cancelled"`) es la única forma de "eliminarlo": nunca se borra físicamente de la base de datos.

### Ejemplo de request

```bash
curl -X PATCH http://localhost:3000/api/events/<id>/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{ "status": "cancelled" }'
```

### Respuesta exitosa (200)

```json
{ "event": { "_id": "...", "status": "cancelled", "organizer": "...", "...": "..." } }
```

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 400 | `status` inválido, evento ya cancelado, o se intenta publicar un evento finalizado/cancelado/vencido | `{"error": "no se puede publicar un evento finalizado o cancelado"}` |
| 401 | No hay cookie de sesión, o el token es inválido/expiró | `{"error": "no autenticado"}` |
| 403 | Rol `user`, o `organizer` que no es dueño del evento | `{"error": "no tenes permiso para modificar el evento"}` |
| 404 | El evento no existe | `{"error": "no existe el evento"}` |

## Listar eventos — GET /api/events

Público, no requiere autenticación. Si no se especifica `status` en el filtro, devuelve por defecto solo los eventos `published`.

### Filtros disponibles (query params)

| Parámetro | Descripción |
|---|---|
| status | Filtra por estado exacto (`draft`, `published`, `cancelled`, `finished`) |
| category | Filtra por categoría exacta |
| location | Filtra por ubicación exacta |
| dateFrom / dateTo | Rango de fechas (`date >= dateFrom` y/o `date <= dateTo`) |
| priceMin / priceMax | Rango de precio |
| search | Búsqueda parcial (case-insensitive) en `title`, `description`, `category` y `location` |
| sort | Campo de ordenamiento para Mongoose (ej. `date`, `-date` para descendente) |
| page | Número de página (default: 1) |
| limit | Resultados por página (default: 10) |

### Ejemplo de request

```bash
curl "http://localhost:3000/api/events?status=published&category=tech&page=1&limit=5&sort=date"
```

### Respuesta exitosa (200)

```json
{
  "data": [ { "_id": "...", "title": "Congreso Tech 2026", "status": "published", "...": "..." } ],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3
}
```

## Listar usuarios — GET /api/users

Ruta administrativa: requiere cookie de sesión válida y rol `admin`.

### Ejemplo de request

```bash
curl http://localhost:3000/api/users \
  -b cookies.txt
```

### Respuesta exitosa (200)

```json
{ "users": [ { "_id": "...", "first_name": "Ana", "last_name": "Pérez", "email": "ana@example.com", "role": "user" } ] }
```

### Errores posibles

| Código | Causa | Ejemplo de respuesta |
|---|---|---|
| 401 | No hay cookie de sesión, o el token es inválido/expiró | `{"error": "no autenticado"}` |
| 403 | Usuario autenticado con rol distinto de `admin` | `{"status":"error","message":"Usuario no autorizado"}` |
