const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const { getClient } = require('../../config/db');

router.get('/', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const { page = 1, limit = 30, accion, entidad, usuario_id, desde, hasta } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('auditoria')
      .select('*', { count: 'exact' });

    if (accion) query = query.eq('accion', accion);
    if (entidad) query = query.eq('entidad', entidad);
    if (usuario_id) query = query.eq('usuario_id', parseInt(usuario_id));
    if (desde) query = query.gte('created_at', desde);
    if (hasta) query = query.lte('created_at', hasta);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    const userIds = [...new Set(data.map((a) => a.usuario_id).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('usuarios')
        .select('id, nombre1, apellido1, email')
        .in('id', userIds);
      (users || []).forEach((u) => { userMap[u.id] = u; });
    }

    const enrichedData = data.map((a) => ({
      ...a,
      usuario_nombre: userMap[a.usuario_id]
        ? `${userMap[a.usuario_id].nombre1} ${userMap[a.usuario_id].apellido1}`
        : 'Sistema',
    }));

    res.json({ success: true, data: enrichedData, total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener auditoría', error: error.message });
  }
});

module.exports = router;
