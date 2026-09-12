const registerAudit = async (supabase, { usuario_id, accion, entidad, entidad_id, detalles, ip }) => {
  try {
    await supabase.from('auditoria').insert({
      usuario_id,
      accion,
      entidad,
      entidad_id,
      detalles: detalles || {},
      ip: ip || req?.ip || null,
    });
  } catch (err) {
    console.error('Error registrando auditoría:', err.message);
  }
};

const buildPagination = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return { page: p, limit: l, offset: (p - 1) * l };
};

// PostgREST interpreta la coma y los paréntesis como sintaxis dentro de .or(),
// así que un texto de búsqueda como "arroz, pollo" rompía la consulta entera
// (PGRST100: failed to parse logic tree). Entre comillas dobles el valor pasa
// a ser literal. JSON.stringify aplica exactamente ese escapado: envuelve en
// comillas dobles y escapa las barras invertidas y comillas del propio texto.
const orLiteral = (value) => JSON.stringify(String(value));

// Los detalles internos (mensajes de Postgres, nombres de columnas, rutas de
// archivo) no deben viajar al cliente: quedan en el log del servidor y afuera
// sale unicamente el mensaje de negocio.
const serverError = (res, message, error) => {
  console.error(message + ':', error?.message || error);
  return res.status(500).json({ success: false, message });
};

module.exports = { registerAudit, buildPagination, orLiteral, serverError };
