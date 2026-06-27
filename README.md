# API de Gestión de Eventos

API REST construida con Node.js y Express, organizada en capas, como base para un sistema de gestión de eventos, entradas (tickets) y usuarios.

## Temática

Plataforma de gestión y venta de entradas para eventos (conciertos, charlas, conferencias, etc.). Permite administrar eventos, usuarios y las entradas asociadas a cada evento.

## Tecnologías

- Node.js
- Express 5
- MongoDB + Mongoose
- bcrypt (hash de contraseñas)
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

## Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/health | Indica que el servidor está activo |
| GET | /api/events | Devuelve la lista de eventos |
| POST | /api/sessions/register | Registra un nuevo usuario (ver detalle abajo) |
| POST | /api/sessions/login | Login: valida email y contraseña, devuelve los datos de la sesión |
| GET | /api/users | Devuelve la lista de usuarios |
| GET | /api/tickets | Devuelve la lista de tickets |

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
