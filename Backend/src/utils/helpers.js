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

module.exports = { registerAudit, buildPagination };
