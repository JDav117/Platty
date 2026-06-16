-- =============================================================
-- Platty - Migración Inicial
-- Supabase / PostgreSQL
-- =============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================
-- ENUM: dificultad
-- =============================================================
DO $$ BEGIN
  CREATE TYPE dificultad AS ENUM ('facil', 'media', 'dificil');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================
-- ENUM: video_tipo
-- =============================================================
DO $$ BEGIN
  CREATE TYPE video_tipo AS ENUM ('cloudinary', 'youtube');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================
-- TABLA: usuarios
-- =============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id              SERIAL PRIMARY KEY,
  nombre1         VARCHAR(100) NOT NULL,
  nombre2         VARCHAR(100) DEFAULT NULL,
  apellido1       VARCHAR(100) NOT NULL,
  apellido2       VARCHAR(100) DEFAULT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  contraseña      VARCHAR(255) NOT NULL,
  bio             VARCHAR(500) DEFAULT NULL,
  avatar_url      VARCHAR(500) DEFAULT NULL,
  rol             VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  token_version   INT NOT NULL DEFAULT 0,
  reset_token     VARCHAR(255) DEFAULT NULL,
  reset_expires   TIMESTAMPTZ DEFAULT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- =============================================================
-- TABLA: categorias
-- =============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(500) DEFAULT NULL,
  imagen_url  VARCHAR(500) DEFAULT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- TABLA: recetas
-- =============================================================
CREATE TABLE IF NOT EXISTS recetas (
  id                  SERIAL PRIMARY KEY,
  usuario_id          INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo              VARCHAR(200) NOT NULL,
  slug                VARCHAR(120) NOT NULL UNIQUE,
  descripcion         TEXT NOT NULL,
  tiempo_preparacion  INT NOT NULL,
  dificultad          dificultad NOT NULL DEFAULT 'media',
  categoria_id        INT REFERENCES categorias(id) ON DELETE SET NULL,
  video_url           VARCHAR(500) DEFAULT NULL,
  video_tipo          video_tipo DEFAULT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recetas_usuario ON recetas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recetas_categoria ON recetas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_recetas_slug ON recetas(slug);
CREATE INDEX IF NOT EXISTS idx_recetas_created ON recetas(created_at DESC);

-- =============================================================
-- TABLA: recetas_imagenes (galería)
-- =============================================================
CREATE TABLE IF NOT EXISTS recetas_imagenes (
  id          SERIAL PRIMARY KEY,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  url         VARCHAR(500) NOT NULL,
  public_id   VARCHAR(255) DEFAULT NULL,
  orden       INT NOT NULL DEFAULT 1 CHECK (orden BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS idx_ri_receta ON recetas_imagenes(receta_id);
CREATE INDEX IF NOT EXISTS idx_ri_orden ON recetas_imagenes(receta_id, orden);

-- =============================================================
-- TABLA: recetas_pasos (instrucciones paso a paso)
-- =============================================================
CREATE TABLE IF NOT EXISTS recetas_pasos (
  id          SERIAL PRIMARY KEY,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  orden       INT NOT NULL CHECK (orden > 0),
  descripcion TEXT NOT NULL,
  imagen_url  VARCHAR(500) DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_rp_receta ON recetas_pasos(receta_id);
CREATE INDEX IF NOT EXISTS idx_rp_orden ON recetas_pasos(receta_id, orden);

-- =============================================================
-- TABLA: recetas_ingredientes
-- =============================================================
CREATE TABLE IF NOT EXISTS recetas_ingredientes (
  id          SERIAL PRIMARY KEY,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  nombre      VARCHAR(200) NOT NULL,
  cantidad    DECIMAL(10,2) NOT NULL CHECK (cantidad > 0),
  unidad      VARCHAR(50) NOT NULL,
  orden       INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_ri2_receta ON recetas_ingredientes(receta_id);

-- =============================================================
-- TABLA: ratings (calificaciones con estrellas)
-- =============================================================
CREATE TABLE IF NOT EXISTS ratings (
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  puntaje     INT NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, receta_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_receta ON ratings(receta_id);

-- =============================================================
-- TABLA: comentarios (anidación 1 nivel - Facebook style)
-- =============================================================
CREATE TABLE IF NOT EXISTS comentarios (
  id          SERIAL PRIMARY KEY,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  parent_id   INT DEFAULT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
  contenido   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_receta ON comentarios(receta_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_usuario ON comentarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_parent ON comentarios(parent_id);

-- =============================================================
-- TABLA: favoritos
-- =============================================================
CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  receta_id   INT NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, receta_id)
);

-- =============================================================
-- TABLA: auditoria
-- =============================================================
CREATE TABLE IF NOT EXISTS auditoria (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion      VARCHAR(20) NOT NULL CHECK (accion IN ('CREATE', 'UPDATE', 'DELETE')),
  entidad     VARCHAR(50) NOT NULL,
  entidad_id  INT DEFAULT NULL,
  detalles    JSONB DEFAULT '{}',
  ip          VARCHAR(45) DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidad ON auditoria(entidad);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(created_at DESC);

-- =============================================================
-- VISTA: recetas_stats (para dashboard y listados)
-- =============================================================
CREATE OR REPLACE VIEW recetas_stats AS
SELECT
  r.id,
  r.titulo,
  r.slug,
  r.descripcion,
  r.tiempo_preparacion,
  r.dificultad,
  r.created_at,
  r.usuario_id,
  u.nombre1 || ' ' || u.apellido1 AS creador_nombre,
  u.avatar_url AS creador_avatar,
  c.nombre AS categoria,
  COALESCE(AVG(rt.puntaje), 0) AS avg_rating,
  COUNT(DISTINCT rt.usuario_id) AS total_ratings,
  COUNT(DISTINCT co.id) AS total_comentarios,
  COUNT(DISTINCT f.usuario_id) AS total_favoritos
FROM recetas r
LEFT JOIN usuarios u ON r.usuario_id = u.id
LEFT JOIN categorias c ON r.categoria_id = c.id
LEFT JOIN ratings rt ON r.id = rt.receta_id
LEFT JOIN comentarios co ON r.id = co.receta_id
LEFT JOIN favoritos f ON r.id = f.receta_id
GROUP BY r.id, u.nombre1, u.apellido1, u.avatar_url, c.nombre;

-- =============================================================
-- DATOS INICIALES
-- =============================================================
INSERT INTO categorias (nombre, slug) VALUES
  ('Desayunos', 'desayunos'),
  ('Almuerzos', 'almuerzos'),
  ('Cenas', 'cenas'),
  ('Postres', 'postres'),
  ('Entradas', 'entradas'),
  ('Ensaladas', 'ensaladas'),
  ('Bebidas', 'bebidas'),
  ('Snacks', 'snacks'),
  ('Sopas', 'sopas'),
  ('Pastas', 'pastas')
ON CONFLICT (slug) DO NOTHING;

-- Password: admin123 (bcrypt hash)
INSERT INTO usuarios (nombre1, apellido1, email, contraseña, rol, email_verified)
VALUES (
  'Admin', 'Platty',
  'admin@platty.app',
  '$2b$10$cWkv6czYf3R7314sM.A/WOtnIn89vim3dZmlCZTkiYIJh/GS6amzu',
  'admin', TRUE
) ON CONFLICT (email) DO NOTHING;
