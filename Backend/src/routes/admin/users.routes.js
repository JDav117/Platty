const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const { getClient } = require('../../config/db');
const AuthModel = require('../../models/auth.model');
const { registerAudit } = require('../../utils/helpers');

router.get('/', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const { page = 1, limit = 20, search, rol } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('usuarios')
      .select('id, nombre1, nombre2, apellido1, apellido2, email, bio, avatar_url, rol, is_active, created_at', { count: 'exact' });

    if (search) {
      query = query.or(`nombre1.ilike.%${search}%,apellido1.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (rol) {
      query = query.eq('rol', rol);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);
    if (error) throw error;

    res.json({ success: true, data, total: count || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
  }
});

router.get('/:id', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre1, nombre2, apellido1, apellido2, email, bio, avatar_url, rol, is_active, created_at, updated_at')
      .eq('id', parseInt(req.params.id))
      .single();
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
});

router.put('/:id/rol', isAdmin, async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['usuario', 'admin'].includes(rol)) {
      return res.status(400).json({ success: false, message: 'Rol inválido. Debe ser usuario o admin' });
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from('usuarios')
      .update({ rol, updated_at: new Date().toISOString() })
      .eq('id', parseInt(req.params.id))
      .select()
      .single();
    if (error) throw error;

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'UPDATE',
      entidad: 'usuarios',
      entidad_id: parseInt(req.params.id),
      detalles: { nuevo_rol: rol },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Rol actualizado', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar rol', error: error.message });
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const supabase = getClient();
    const userId = parseInt(req.params.id);

    if (userId === req.usuario.id) {
      return res.status(400).json({ success: false, message: 'No puedes eliminarte a ti mismo' });
    }

    await supabase.from('usuarios').delete().eq('id', userId);

    registerAudit(supabase, {
      usuario_id: req.usuario.id,
      accion: 'DELETE',
      entidad: 'usuarios',
      entidad_id: userId,
      ip: req.ip,
    });

    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
