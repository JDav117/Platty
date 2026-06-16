const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { ratingSchema } = require('../validations/user.schema');
const { getClient } = require('../config/db');

router.post('/', authMiddleware, validate(ratingSchema), async (req, res) => {
  try {
    const { receta_id, puntaje } = req.body;
    if (!receta_id) {
      return res.status(400).json({ success: false, message: 'receta_id es requerido' });
    }

    const supabase = getClient();

    const { data: existing } = await supabase
      .from('ratings')
      .select('*')
      .eq('usuario_id', req.usuario.id)
      .eq('receta_id', parseInt(receta_id))
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('ratings')
        .update({ puntaje })
        .eq('usuario_id', req.usuario.id)
        .eq('receta_id', parseInt(receta_id))
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, message: 'Calificación actualizada', data });
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert({ usuario_id: req.usuario.id, receta_id: parseInt(receta_id), puntaje })
      .select()
      .single();
    if (error) throw error;

    res.status(201).json({ success: true, message: 'Calificación registrada', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al calificar', error: error.message });
  }
});

router.get('/:recetaId', async (req, res) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('ratings')
      .select('puntaje')
      .eq('receta_id', parseInt(req.params.recetaId));
    if (error) throw error;

    const total = data.length;
    const avg = total > 0 ? data.reduce((sum, r) => sum + r.puntaje, 0) / total : 0;

    res.json({
      success: true,
      data: {
        avg_rating: Math.round(avg * 10) / 10,
        total_ratings: total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener calificaciones', error: error.message });
  }
});

module.exports = router;
