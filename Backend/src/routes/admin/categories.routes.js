const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const validate = require('../../middlewares/validate');
const { categorySchema } = require('../../validations/recipe.schema');
const { getClient } = require('../../config/db');
const { generateSlug } = require('../../utils/generateSlug');
const { registerAudit } = require('../../utils/helpers');

router.get('/', isAdmin, async (req, res) => {
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

router.post('/', isAdmin, validate(categorySchema), async (req, res) => {
  try {
    const supabase = getClient();
    const slug = generateSlug(req.body.nombre);

    const { data, error } = await supabase
      .from('categorias')
      .insert({ nombre: req.body.nombre, descripcion: req.body.descripcion || null, slug })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
      }
      throw error;
    }

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'CREATE',
      entidad: 'categorias',
      entidad_id: data.id,
      detalles: { nombre: data.nombre },
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'Categoría creada', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear categoría', error: error.message });
  }
});

router.put('/:id', isAdmin, validate(categorySchema), async (req, res) => {
  try {
    const supabase = getClient();
    const slug = generateSlug(req.body.nombre);

    const { data, error } = await supabase
      .from('categorias')
      .update({ nombre: req.body.nombre, descripcion: req.body.descripcion || null, slug })
      .eq('id', parseInt(req.params.id))
      .select()
      .single();
    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
      }
      throw error;
    }

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'UPDATE',
      entidad: 'categorias',
      entidad_id: parseInt(req.params.id),
      detalles: { nombre: data.nombre },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Categoría actualizada', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar categoría', error: error.message });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    await supabase.from('categorias').delete().eq('id', parseInt(req.params.id));

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'DELETE',
      entidad: 'categorias',
      entidad_id: parseInt(req.params.id),
      ip: req.ip,
    });

    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar categoría', error: error.message });
  }
});

module.exports = router;
