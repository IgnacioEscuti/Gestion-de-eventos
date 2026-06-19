# API de Gestión de Eventos

API REST construida con Node.js y Express, organizada en capas, como base para un sistema de gestión de eventos, entradas (tickets) y usuarios.

## Temática

Plataforma de gestión y venta de entradas para eventos (conciertos, charlas, conferencias, etc.). Permite administrar eventos, usuarios y las entradas asociadas a cada evento.

## Tecnologías

- Node.js
- Express 5
- MongoDB + Mongoose
- dotenv
- JavaScript ES Modules (import/export)

## Instalación

```bash
git clone <url-del-repositorio>
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
  dao/           # Acceso a datos (Data Access Objects)
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
| POST | /api/sessions | Login (estructura inicial, sin lógica de autenticación implementada) |
| DELETE | /api/sessions | Logout (estructura inicial, sin lógica de autenticación implementada) |
| GET | /api/users | Devuelve la lista de usuarios |
| GET | /api/tickets | Devuelve la lista de tickets |
