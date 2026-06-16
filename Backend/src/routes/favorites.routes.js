const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { getClient } = require('../config/db');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const supabase = getClient();
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('favoritos')
      .select('receta_id', { count: 'exact' })
      .eq('usuario_id', req.usuario.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    const recetaIds = data.map((f) => f.receta_id);
    let recetas = [];
    if (recetaIds.length > 0) {
      const { data: r, error: rError } = await supabase
        .from('recetas_stats')
        .select('*')
        .in('id', recetaIds);
      if (rError) throw rError;
      recetas = r || [];
    }

    const recetaMap = {};
    recetas.forEach((r) => { recetaMap[r.id] = r; });

    const sortedRecetas = recetaIds.map((id) => recetaMap[id]).filter(Boolean);

    res.json({ success: true, data: sortedRecetas, total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener favoritos', error: error.message });
  }
});

router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { receta_id } = req.body;
    if (!receta_id) {
      return res.status(400).json({ success: false, message: 'receta_id es requerido' });
    }

    const supabase = getClient();

    const { data: existing } = await supabase
      .from('favoritos')
      .select('*')
      .eq('usuario_id', req.usuario.id)
      .eq('receta_id', parseInt(receta_id))
      .maybeSingle();

    if (existing) {
      await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', req.usuario.id)
        .eq('receta_id', parseInt(receta_id));
      return res.json({ success: true, message: 'Eliminado de favoritos', favorito: false });
    }

    await supabase
      .from('favoritos')
      .insert({ usuario_id: req.usuario.id, receta_id: parseInt(receta_id) });

    res.json({ success: true, message: 'Añadido a favoritos', favorito: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar favorito', error: error.message });
  }
});

router.get('/check/:recetaId', authMiddleware, async (req, res) => {
  try {
    const supabase = getClient();
    const { data } = await supabase
      .from('favoritos')
      .select('*')
      .eq('usuario_id', req.usuario.id)
      .eq('receta_id', parseInt(req.params.recetaId))
      .maybeSingle();

    res.json({ success: true, favorito: !!data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al verificar favorito', error: error.message });
  }
});

module.exports = router;
