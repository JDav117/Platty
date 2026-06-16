const express = require('express');
const router = express.Router();
const { getClient } = require('../config/db');

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
    res.status(500).json({ success: false, message: 'Error al obtener categorías', error: error.message });
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
    res.status(500).json({ success: false, message: 'Error al obtener categoría', error: error.message });
  }
});

module.exports = router;
