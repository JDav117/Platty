const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const { getClient } = require('../../config/db');
const { registerAudit } = require('../../utils/helpers');

router.get('/', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('recetas_stats')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`titulo.ilike.%${search}%,creador_nombre.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({ success: true, data, total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener recetas', error: error.message });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const recetaId = parseInt(req.params.id);

    const { data: receta } = await supabase
      .from('recetas')
      .select('titulo')
      .eq('id', recetaId)
      .single();

    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    await supabase.from('recetas').delete().eq('id', recetaId);

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'DELETE',
      entidad: 'recetas',
      entidad_id: recetaId,
      detalles: { titulo: receta.titulo },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar receta', error: error.message });
  }
});

module.exports = router;
