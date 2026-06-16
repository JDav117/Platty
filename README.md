<div align="center">
  <a href="https://github.com/JDav117/Platty">
    <img src="Frontend/public/Platty-Logo.png" alt="Platty Logo" width="120" height="120" style="animation: float 3s ease-in-out infinite; display: inline-block;">
  </a>

  <h1 align="center" style="font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #FEC021, #C68F26); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Platty</h1>

  <p align="center" style="font-size: 1.2rem; color: #666;">
    <strong><em>Cocina, postea y saborea.</em></strong>
  </p>

  <p align="center">
    Red social de cocina para compartir recetas, descubrir nuevas ideas y conectar con foodies.
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React 19">
    <img src="https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite 6">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS 4">
    <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js 22">
    <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express 4.21">
    <img src="https://img.shields.io/badge/Supabase-Cloud-3FCF8E?logo=supabase&logoColor=white&style=for-the-badge" alt="Supabase Cloud">
    <img src="https://img.shields.io/badge/Zustand-State_Mgmt-443E38?logo=react&logoColor=white&style=for-the-badge" alt="Zustand">
    <img src="https://img.shields.io/badge/Passport-OAuth-34E27A?logo=passport&logoColor=white&style=for-the-badge" alt="Passport OAuth">
    <img src="https://img.shields.io/badge/Cloudinary-Images-3448C5?logo=cloudinary&logoColor=white&style=for-the-badge" alt="Cloudinary">
    <img src="https://img.shields.io/badge/Nodemailer-Email-30B980?logo=gmail&logoColor=white&style=for-the-badge" alt="Nodemailer">
    <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge" alt="JWT">
    <img src="https://img.shields.io/badge/Zustand-Persist-443E38?logo=react&logoColor=white&style=for-the-badge" alt="Zustand Persist">
  </p>
</div>

<hr>

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
  - [Prerrequisitos](#prerrequisitos)
  - [Configuración del Frontend](#configuración-del-frontend)
  - [Configuración del Backend](#configuración-del-backend)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos (Supabase)](#base-de-datos-supabase)
- [Autenticación](#autenticación)
- [API Endpoints](#api-endpoints)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Licencia](#licencia)

<hr>

## Descripción

**Platty** es una red social de cocina donde los usuarios pueden compartir sus recetas, explorar nuevas ideas culinarias, interactuar con la comunidad a través de comentarios y calificaciones, y guardar sus platos favoritos. Construida con un stack moderno JavaScript (React + Node.js) sobre Supabase Cloud.

## Características

- **Registro e inicio de sesión** con email + OTP y Google OAuth
- **Verificación de email** mediante código numérico OTP
- **Restricción de dominios** de email (solo Gmail, Hotmail, Outlook, etc.)
- **Recetas CRUD** con imágenes, ingredientes y pasos detallados
- **Galería de imágenes** vía Cloudinary
- **Búsqueda en tiempo real** con debounce
- **Filtros por categoría** y ordenamiento (recientes, mejor calificadas, populares)
- **Calificaciones** (1-5 estrellas) y **comentarios** anidados
- **Favoritos** para guardar recetas
- **Perfiles de usuario** con avatar y estadísticas
- **Panel de administración** con dashboard, gestión de usuarios, recetas y categorías
- **Exportación de reportes** en Excel y PDF
- **Auditoría** de acciones CRUD
- **Modo oscuro** / claro
- **Diseño responsive** (mobile-first con BottomNav)
- **Paleta de colores dorada** personalizada

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [React](https://react.dev/) | 19.0 | UI framework |
| [Vite](https://vitejs.dev/) | 6.4 | Build tool / bundler |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilos utilitarios |
| [Zustand](https://github.com/pmndrs/zustand) | — | Estado global persistente |
| [React Router](https://reactrouter.com/) | 7 | Enrutamiento SPA |
| [Axios](https://axios-http.com/) | — | HTTP client |
| [sonner](https://sonner.emilkowal.ski/) | — | Notificaciones toast |
| [react-icons](https://react-icons.github.io/react-icons/) | — | Iconos SVG |
| [formkit/auto-animate](https://auto-animate.formkit.com/) | — | Animaciones |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Node.js](https://nodejs.org/) | 22 | Runtime |
| [Express](https://expressjs.com/) | 4.21 | Framework HTTP |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | 2.49 | Cliente PostgreSQL |
| [Passport](http://www.passportjs.org/) | — | Google OAuth |
| [JWT](https://jwt.io/) | — | Autenticación Bearer |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 5.1 | Hash de contraseñas |
| [Nodemailer](https://nodemailer.com/) | — | Envío de emails (OTP, recuperación) |
| [Cloudinary](https://cloudinary.com/) | 2.5 | Almacenamiento de imágenes |
| [Multer](https://github.com/expressjs/multer) | 1.4 | Upload de archivos |
| [Joi](https://joi.dev/) | 17.13 | Validación de schemas |
| [Morgan](https://github.com/expressjs/morgan) | — | Logging HTTP |
| [Helmet](https://helmetjs.github.io/) | 8 | Seguridad HTTP headers |
| [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) | 7 | Rate limiting |
| [PDFKit](https://pdfkit.org/) | — | Generación de PDF |
| [ExcelJS](https://github.com/exceljs/exceljs) | — | Exportación Excel |
| [UUID](https://github.com/uuidjs/uuid) | 11 | IDs únicos |

### Base de Datos

| Tecnología | Propósito |
|------------|-----------|
| [Supabase Cloud](https://supabase.com/) | PostgreSQL administrado + REST API |
| [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security) | Seguridad a nivel de fila |

## Estructura del Proyecto

```
YUM YUM/
├── Backend/                      # API REST (Express + Supabase)
│   ├── src/
│   │   ├── config/               # Configuraciones (db, cloudinary, passport)
│   │   ├── middlewares/           # Auth, validación, upload, rate limiter
│   │   ├── models/               # Capa de datos (Supabase queries)
│   │   ├── routes/               # Rutas Express
│   │   │   ├── admin/            # Rutas administrativas
│   │   │   ├── auth.routes.js    # Auth local + OTP
│   │   │   ├── auth.google.routes.js  # Google OAuth
│   │   │   ├── recipes.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── categories.routes.js
│   │   │   ├── comments.routes.js
│   │   │   ├── ratings.routes.js
│   │   │   ├── favorites.routes.js
│   │   │   └── search.routes.js
│   │   ├── utils/                # Email, slugs, PDF, Excel
│   │   └── validations/          # Schemas Joi
│   ├── supabase/
│   │   └── migrations/           # Migraciones SQL
│   ├── server.js                 # Entry point
│   └── package.json
│
├── Frontend/                     # SPA (React + Vite + Tailwind)
│   ├── public/                   # Assets estáticos
│   ├── src/
│   │   ├── api/                  # Cliente Axios + endpoints
│   │   ├── components/
│   │   │   ├── admin/            # Sidebar admin
│   │   │   ├── auth/             # ProtectedRoute, AdminRoute
│   │   │   ├── comments/         # Form, item, section
│   │   │   ├── layout/           # Navbar, BottomNav, ProfileLayout
│   │   │   ├── profile/          # Info, recipes, favorites, settings
│   │   │   ├── recipes/          # Card, detail, form
│   │   │   └── ui/               # Button, SearchBar, Spinner, etc.
│   │   ├── pages/                # Páginas del router
│   │   ├── store/                # Zustand stores
│   │   └── utils/                # Formateo, constantes
│   ├── tailwind.config.js        # Paleta de colores personalizada
│   ├── vite.config.js            # Proxy API
│   └── package.json
│
├── .gitignore
└── README.md
```

## Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- Una cuenta en [Supabase Cloud](https://supabase.com/) (gratuita)
- (Opcional) Cuenta en [Cloudinary](https://cloudinary.com/) para imágenes
- (Opcional) Credenciales [Google OAuth](https://console.cloud.google.com/apis/credentials)

### Configuración del Frontend

```bash
cd Frontend
npm install
```

### Configuración del Backend

```bash
cd Backend
npm install
```

Copia el archivo de variables de entorno y completa los valores:

```bash
cp .env.example .env   # Si existe, o crea manualmente
```

<hr>

## Variables de Entorno

### Backend (`Backend/.env`)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor (default: 3000) | No |
| `SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `SUPABASE_ANON_KEY` | Anon key pública de Supabase | Sí |
| `SUPABASE_SERVICE_KEY` | Service role key (admin) | Sí |
| `JWT_SECRET` | Secreto para firmar JWT | Sí |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | No |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | Para imágenes |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | Para imágenes |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary | Para imágenes |
| `SMTP_HOST` | Servidor SMTP | Para emails |
| `SMTP_PORT` | Puerto SMTP | Para emails |
| `SMTP_USER` | Usuario SMTP | Para emails |
| `SMTP_PASS` | Contraseña SMTP | Para emails |
| `EMAIL_FROM` | Dirección from en emails | Para emails |
| `FRONTEND_URL` | URL del frontend (CORS) | Sí |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Para Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Para Google login |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback | Para Google login |

<hr>

## Base de Datos (Supabase)

Platty usa **Supabase Cloud** como base de datos PostgreSQL. Las migraciones se encuentran en `Backend/supabase/migrations/`.

### Migraciones

1. **`202606140001_create_tables.sql`** — Tablas principales: usuarios, categorías, recetas, ingredientes, pasos, imágenes, ratings, comentarios, favoritos, auditoría + vista `recetas_stats`
2. **`202606140002_functions.sql`** — Funciones RPC: `increment_token_version`, `get_monthly_counts`
3. **`202606160001_otp_verification.sql`** — Columnas OTP: `email_verified`, `otp_code`, `otp_expires`

### Esquema

```
usuarios → recetas → recetas_imagenes
                   → recetas_ingredientes
                   → recetas_pasos
                   → ratings
                   → comentarios (anidados, 1 nivel)
                   → favoritos
auditoria (log de acciones)
```

### Vistas

- `recetas_stats`: Vista materializada con métricas agregadas (rating promedio, total comentarios, favoritos, etc.)

<hr>

## Autenticación

Platty implementa tres sistemas de autenticación:

### 1. Registro Local + OTP
1. Usuario se registra con email, nombre y contraseña
2. Se envía un código numérico de 6 dígitos al correo
3. Usuario ingresa el código para verificar su cuenta
4. Solo se permiten correos de dominios conocidos (Gmail, Hotmail, Outlook, etc.)

### 2. Inicio de Sesión Local
- Login con email y contraseña
- Se verifica si el email está confirmado antes de permitir el acceso
- JWT con refresh token (24h / 7d)

### 3. Google OAuth
- Login con un clic usando cuenta de Google
- No requiere verificación OTP (Google ya verificó el email)
- Crea el usuario automáticamente si no existe
- Actualiza el avatar si no tiene uno

<hr>

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Registro (envía OTP) |
| `POST` | `/api/auth/verify-otp` | Verifica código OTP |
| `POST` | `/api/auth/resend-otp` | Reenvía código OTP |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `POST` | `/api/auth/refresh` | Refrescar JWT |
| `GET` | `/api/auth/me` | Perfil del usuario autenticado |
| `GET` | `/api/auth/google` | Iniciar Google OAuth |
| `GET` | `/api/auth/google/callback` | Callback Google OAuth |
| `POST` | `/api/auth/forgot-password` | Solicitar recuperación |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/users/profile` | Perfil propio |
| `PUT` | `/api/users/profile` | Actualizar perfil |
| `PUT` | `/api/users/avatar` | Actualizar avatar |
| `PUT` | `/api/users/password` | Cambiar contraseña |
| `POST` | `/api/users/deactivate` | Desactivar cuenta |

### Recetas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/recipes` | Listar (paginado, filtros, búsqueda) |
| `GET` | `/api/recipes/:slug` | Detalle (con imágenes, pasos, ingredientes) |
| `GET` | `/api/recipes/user/:id` | Recetas por usuario |
| `POST` | `/api/recipes` | Crear (multipart) |
| `PUT` | `/api/recipes/:id` | Actualizar |
| `DELETE` | `/api/recipes/:id` | Eliminar |

### Interacciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/comments` | Comentarios CRUD |
| `GET/POST` | `/api/ratings` | Calificaciones (1-5) |
| `GET/POST/DELETE` | `/api/favorites` | Favoritos |

### Administración

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/admin/dashboard` | Dashboard con métricas |
| CRUD | `/api/admin/users` | Gestión de usuarios |
| CRUD | `/api/admin/recipes` | Gestión de recetas |
| CRUD | `/api/admin/categories` | Gestión de categorías |
| `GET` | `/api/admin/audit` | Log de auditoría |
| `GET` | `/api/admin/reports` | Reportes (Excel/PDF) |

<hr>

## Despliegue

### Desarrollo

```bash
# Terminal 1: Backend
cd Backend && npm run dev

# Terminal 2: Frontend
cd Frontend && npm run dev
```

El frontend corre en `http://localhost:5173` con proxy al backend en `http://localhost:3000`.

### Producción

```bash
# Build frontend
cd Frontend && npm run build

# Los archivos estáticos estarán en Frontend/dist/
# Sirve el frontend desde tu servidor web o súbelo a Vercel/Netlify
# El backend puede desplegarse en Railway, Render, Fly.io, etc.
```

<hr>

## Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit a tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

<hr>

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

<hr>

<div align="center">
  <sub>Hecho con ❤️ por la comunidad Platty</sub>
  <br>
  <sub>Cocina, postea y saborea.</sub>
</div>
