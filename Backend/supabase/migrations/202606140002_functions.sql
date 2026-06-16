-- =============================================================
-- YUM YUM v2 - Funciones y RPCs
-- =============================================================

-- Función para incrementar token_version
CREATE OR REPLACE FUNCTION increment_token_version(user_id INT)
RETURNS INT AS $$
  UPDATE usuarios
  SET token_version = token_version + 1, updated_at = NOW()
  WHERE id = user_id
  RETURNING token_version;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para obtener conteos mensuales (dashboard)
CREATE OR REPLACE FUNCTION get_monthly_counts(tabla TEXT)
RETURNS TABLE(mes INT, anio INT, total BIGINT) AS $$
BEGIN
  RETURN QUERY EXECUTE
    format(
      'SELECT EXTRACT(MONTH FROM created_at)::INT AS mes,
              EXTRACT(YEAR FROM created_at)::INT AS anio,
              COUNT(*)::BIGINT AS total
       FROM %I
       WHERE created_at >= NOW() - INTERVAL ''12 months''
       GROUP BY anio, mes
       ORDER BY anio DESC, mes DESC',
      tabla
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
