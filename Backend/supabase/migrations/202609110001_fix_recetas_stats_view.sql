-- =============================================================
-- Platty - Fix: columnas faltantes en la vista recetas_stats
-- =============================================================
-- La vista original omitia 4 columnas de la tabla `recetas`:
--   categoria_id, video_url, video_tipo, updated_at
--
-- Como todas las lecturas de recetas pasan por esta vista
-- (recipes.model.js, search.routes.js, favorites.routes.js),
-- esas columnas eran invisibles para la aplicacion:
--
--   1) Filtro por categoria roto (HTTP 500)
--      recipes.model.js:13 y search.routes.js:20 hacen
--      .eq('categoria_id', ...) contra la vista -> error 42703
--      "column recetas_stats.categoria_id does not exist".
--      Efecto: elegir cualquier categoria en Home vacia la grilla.
--
--   2) Formulario de edicion pierde la categoria
--      findById no devuelve categoria_id -> RecipeForm.jsx:31 cae
--      a '' y la validacion de la linea 55 bloquea el guardado
--      hasta volver a elegirla a mano.
--
--   3) El video nunca se muestra
--      RecipeDetail.jsx:56 evalua `recipe.video_url &&`, siempre
--      undefined. El video si esta guardado en BD (POST y PUT lo
--      escriben bien), pero no se puede ver, corregir ni eliminar.
--
-- Nota: CREATE OR REPLACE VIEW en PostgreSQL solo permite AGREGAR
-- columnas al final, conservando nombre/tipo/orden de las
-- existentes. Por eso las 4 nuevas van al final y no intercaladas
-- (intercalarlas exigiria DROP VIEW).
--
-- El GROUP BY no cambia: r.id es PRIMARY KEY, asi que PostgreSQL
-- resuelve por dependencia funcional el resto de columnas de `r`.
--
-- No requiere ningun cambio en el codigo JS.
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
  COUNT(DISTINCT f.usuario_id) AS total_favoritos,
  -- ----- columnas agregadas por esta migracion -----
  r.categoria_id,
  r.video_url,
  r.video_tipo,
  r.updated_at
FROM recetas r
LEFT JOIN usuarios u ON r.usuario_id = u.id
LEFT JOIN categorias c ON r.categoria_id = c.id
LEFT JOIN ratings rt ON r.id = rt.receta_id
LEFT JOIN comentarios co ON r.id = co.receta_id
LEFT JOIN favoritos f ON r.id = f.receta_id
GROUP BY r.id, u.nombre1, u.apellido1, u.avatar_url, c.nombre;

-- =============================================================
-- VERIFICACION (opcional, ejecutar despues del CREATE anterior)
-- =============================================================
-- Debe listar 19 columnas, con categoria_id / video_url /
-- video_tipo / updated_at en las posiciones 16 a 19:
--
--   SELECT ordinal_position, column_name
--   FROM information_schema.columns
--   WHERE table_name = 'recetas_stats'
--   ORDER BY ordinal_position;
