const express = require('express');
const router = express.Router();
const { getClient } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { q, categoria_id, dificultad, ordenar, page = 1, limit = 12 } = req.query;
    const supabase = getClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('recetas_stats')
      .select('*', { count: 'exact' });

    if (q) {
      query = query.or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%`);
    }

    if (categoria_id) {
      query = query.eq('categoria_id', parseInt(categoria_id));
    }

    if (dificultad) {
      query = query.eq('dificultad', dificultad);
    }

    if (ordenar === 'rating') {
      query = query.order('avg_rating', { ascending: false });
    } else if (ordenar === 'populares') {
      query = query.order('total_favoritos', { ascending: false });
    } else if (ordenar === 'comentarios') {
      query = query.order('total_comentarios', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query.range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({ success: true, data, total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en la búsqueda', error: error.message });
  }
});

module.exports = router;
