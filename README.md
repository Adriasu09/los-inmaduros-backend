# 🛼 Los Inmaduros Backend

API REST profesional para la comunidad de patinadores **Los Inmaduros Rollers Madrid**. Backend completo con autenticación, gestión de rutas, convocatorias, reviews y galería de fotos.

## 🚀 Características Principales

- ✅ **Autenticación segura** con Clerk
- ✅ **Sistema de rutas** predefinidas con niveles de dificultad
- ✅ **Convocatorias (Route Calls)** con puntos de encuentro
- ✅ **Sistema de asistencias** a convocatorias
- ✅ **Reviews y valoraciones** de rutas
- ✅ **Favoritos** personalizados por usuario
- ✅ **Galería de fotos** con moderación y Supabase Storage
- ✅ **Paginación** en todos los endpoints de listados
- ✅ **Rate limiting** para protección contra ataques
- ✅ **Validación estricta** con Zod
- ✅ **Documentación Swagger** completa e interactiva

---

## 🛠️ Tecnologías

- **Node.js** + **TypeScript** - Runtime y lenguaje
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Clerk** - Autenticación y gestión de usuarios
- **Supabase Storage** - Almacenamiento de imágenes
- **Zod** - Validación de schemas
- **Swagger/OpenAPI** - Documentación de API
- **Express Rate Limit** - Protección contra ataques

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta de Clerk (https://clerk.com)
- Cuenta de Supabase (https://supabase.com)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/Adriasu09/los-inmaduros-backend.git
cd los-inmaduros-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=4000
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/los_inmaduros

# Supabase Storage
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_tu_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_tu_publishable_key
```

4. **Ejecutar migraciones de Prisma**

```bash
npx prisma migrate dev
```

5. **Ejecutar el servidor en desarrollo**

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:4000` 🚀

---

## 📚 Documentación API

La documentación completa e interactiva está disponible en **Swagger UI**:

👉 **http://localhost:4000/api-docs**

### Endpoints Principales

| Método | Endpoint                           | Descripción                         | Auth |
| ------ | ---------------------------------- | ----------------------------------- | ---- |
| `GET`  | `/api/routes`                      | Listar todas las rutas              | No   |
| `GET`  | `/api/routes/:slug`                | Detalle de ruta con reviews y fotos | No   |
| `POST` | `/api/routes/:routeId/reviews`     | Crear review                        | Sí   |
| `GET`  | `/api/route-calls`                 | Listar convocatorias (paginado)     | No   |
| `POST` | `/api/route-calls`                 | Crear convocatoria                  | Sí   |
| `POST` | `/api/route-calls/:id/attendances` | Confirmar asistencia                | Sí   |
| `GET`  | `/api/photos`                      | Listar fotos (paginado)             | No   |
| `POST` | `/api/photos`                      | Subir foto                          | Sí   |
| `GET`  | `/api/favorites`                   | Mis rutas favoritas                 | Sí   |
| `POST` | `/api/routes/:routeId/favorites`   | Añadir a favoritos                  | Sí   |

---

## 🔒 Seguridad

### Implementaciones de Seguridad

✅ **Rate Limiting**

- General: 100 peticiones/15 min por IP
- Autenticación: 5 peticiones/15 min por IP
- Creación de recursos: 20 peticiones/15 min por IP

✅ **CORS Configurado**

- Solo acepta peticiones del frontend específico
- Credenciales habilitadas de forma segura

✅ **Validación Estricta**

- Todos los inputs validados con Zod
- UUIDs verificados
- Fechas futuras en convocatorias
- URLs de Google Maps verificadas

✅ **Subida de Archivos Segura**

- Sanitización de nombres de archivo
- Validación MIME type vs extensión
- Límite de 5MB por imagen
- Solo formatos: JPEG, PNG, GIF, WebP

✅ **Protección de Datos**

- Errores detallados solo en desarrollo
- Stack traces ocultos en producción
- Variables de entorno requeridas

---

## 🗄️ Estructura del Proyecto

```
los-inmaduros-backend/
├── prisma/
│   ├── migrations/          # Migraciones de base de datos
│   └── schema.prisma        # Schema de Prisma
├── src/
│   ├── config/              # Configuración (env, swagger, supabase)
│   ├── database/            # Cliente de Prisma
│   ├── modules/             # Módulos de la aplicación
│   │   ├── routes/          # Rutas predefinidas
│   │   ├── route-calls/     # Convocatorias
│   │   ├── reviews/         # Valoraciones
│   │   ├── favorites/       # Favoritos
│   │   ├── attendances/     # Asistencias
│   │   ├── photos/          # Fotos y galería
│   │   ├── auth/            # Autenticación
│   │   └── config/          # Configuración global
│   ├── shared/              # Código compartido
│   │   ├── middlewares/     # Rate limiting, validación, auth
│   │   ├── services/        # Storage, user sync
│   │   ├── errors/          # Custom errors
│   │   └── constants/       # Constantes
│   └── app.ts               # Punto de entrada
├── .env.example             # Ejemplo de variables de entorno
├── package.json
└── README.md
```

---

## 🎯 Paginación

Todos los endpoints de listados soportan paginación:

### Parámetros

- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 20, max: 100)

### Ejemplo

```bash
GET /api/route-calls?page=2&limit=10
```

### Respuesta

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "totalCount": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

---

## 🧪 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio

# Generar cliente de Prisma
npx prisma generate
```

---

## 🌐 Despliegue

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu servicio de hosting (Render, Railway, etc.):

```env
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
DATABASE_URL=tu_postgresql_production_url
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
CLERK_SECRET_KEY=tu_clerk_secret_key
CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
```

### Recomendaciones

- **Backend**: Render.com (plan gratuito)
- **Base de datos**: Render PostgreSQL o Supabase
- **Storage**: Supabase Storage

---

## 👤 Autor

**Adriana** - Frontend Developer  
[GitHub](https://github.com/Adriasu09) | [LinkedIn](www.linkedin.com/in/adriana-suárez-4562a5249)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🤝 Contribuciones

Este es un proyecto de portfolio personal, pero sugerencias y feedback son bienvenidos.

---

**Hecho con ❤️ para la comunidad de patinadores Los Inmaduros Rollers Madrid 🛼**
