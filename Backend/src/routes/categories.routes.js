const express = require('express');
const router = express.Router();
const { getClient } = require('../config/db');
const { serverError } = require('../utils/helpers');

router.get('/', async (req, res) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    serverError(res, 'Error al obtener categorías', error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    serverError(res, 'Error al obtener categoría', error);
  }
});

module.exports = router;
