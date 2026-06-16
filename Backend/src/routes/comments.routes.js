const express = require('express');
const router = express.Router();
const CommentsModel = require('../models/comments.model');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { commentSchema } = require('../validations/user.schema');

router.get('/recipe/:recetaId', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await CommentsModel.findByReceta(parseInt(req.params.recetaId), {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener comentarios', error: error.message });
  }
});

router.post('/', authMiddleware, validate(commentSchema), async (req, res) => {
  try {
    const { receta_id, contenido, parent_id } = req.body;
    if (!receta_id) {
      return res.status(400).json({ success: false, message: 'receta_id es requerido' });
    }
    if (parent_id) {
      const parentComment = await CommentsModel.findById(parent_id);
      if (!parentComment) {
        return res.status(404).json({ success: false, message: 'Comentario padre no encontrado' });
      }
      if (parentComment.parent_id) {
        return res.status(400).json({ success: false, message: 'Solo se permite un nivel de anidación' });
      }
    }

    const comment = await CommentsModel.create({
      receta_id: parseInt(receta_id),
      usuario_id: req.usuario.id,
      contenido,
      parent_id: parent_id || null,
    });

    res.status(201).json({ success: true, message: 'Comentario creado', data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear comentario', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const isOwner = await CommentsModel.isOwner(parseInt(id), req.usuario.id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    const { contenido } = req.body;
    if (!contenido) {
      return res.status(400).json({ success: false, message: 'El contenido es requerido' });
    }

    const comment = await CommentsModel.update(parseInt(id), contenido);
    res.json({ success: true, message: 'Comentario actualizado', data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar comentario', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const isOwner = await CommentsModel.isOwner(parseInt(id), req.usuario.id);
    if (!isOwner && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    await CommentsModel.delete(parseInt(id));
    res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar comentario', error: error.message });
  }
});

module.exports = router;
