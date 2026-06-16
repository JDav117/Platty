const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const RecipesModel = require('../models/recipes.model');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRecipeSchema, updateRecipeSchema } = require('../validations/recipe.schema');
const { upload, uploadToCloudinary, uploadImages, handleUploadError } = require('../middlewares/upload');
const { makeUniqueSlug } = require('../utils/generateSlug');
const { getClient } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { page, limit, categoria_id, search, ordenar } = req.query;
    const result = await RecipesModel.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
      categoria_id: categoria_id ? parseInt(categoria_id) : null,
      search,
      ordenar,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener recetas', error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await RecipesModel.findByUserId(parseInt(req.params.userId), {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener recetas del usuario', error: error.message });
  }
});

router.get('/:identificador', async (req, res) => {
  try {
    const { identificador } = req.params;
    const isId = /^\d+$/.test(identificador);
    const receta = isId ? await RecipesModel.findById(parseInt(identificador)) : await RecipesModel.findBySlug(identificador);
    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    const [imagenes, pasos, ingredientes] = await Promise.all([
      RecipesModel.getImagenes(receta.id),
      RecipesModel.getPasos(receta.id),
      RecipesModel.getIngredientes(receta.id),
    ]);

    res.json({
      success: true,
      data: { ...receta, imagenes, pasos, ingredientes },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener receta', error: error.message });
  }
});

router.post('/', authMiddleware, (req, res, next) => {
  uploadImages(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    try {
      const { error: valError } = createRecipeSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (valError) {
        const messages = valError.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: 'Error de validación', errors: messages });
      }

      const files = req.files || [];
      if (files.length > 5) {
        return res.status(400).json({ success: false, message: 'Máximo 5 imágenes' });
      }

      for (const file of files) {
        if (file.mimetype.startsWith('image/') && file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ success: false, message: 'Cada imagen no puede superar los 10MB' });
        }
      }

      const slug = await makeUniqueSlug(getClient(), req.body.titulo);
      const recetaData = {
        usuario_id: req.usuario.id,
        titulo: req.body.titulo,
        slug,
        descripcion: req.body.descripcion,
        tiempo_preparacion: parseInt(req.body.tiempo_preparacion),
        dificultad: req.body.dificultad,
        categoria_id: parseInt(req.body.categoria_id),
        video_url: req.body.video_url || null,
        video_tipo: req.body.video_tipo || null,
      };

      const receta = await RecipesModel.create(recetaData);

      const imagenesUrls = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadToCloudinary(files[i].buffer, {
          folder: 'yum_yum/recipes',
          transformation: { width: 1200, crop: 'limit', quality: 'auto' },
        });
        imagenesUrls.push(result);
        await RecipesModel.addImagen({
          receta_id: receta.id,
          url: result.secure_url,
          public_id: result.public_id,
          orden: i + 1,
        });
      }

      const ingredientes = JSON.parse(req.body.ingredientes || '[]');
      await RecipesModel.setIngredientes(receta.id, ingredientes);

      const pasos = JSON.parse(req.body.pasos || '[]');
      await RecipesModel.setPasos(receta.id, pasos);

      res.status(201).json({
        success: true,
        message: 'Receta creada exitosamente',
        data: { id: receta.id, slug: receta.slug },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear receta', error: error.message });
    }
  });
});

router.put('/:id', authMiddleware, (req, res, next) => {
  uploadImages(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    try {
      const { id } = req.params;
      const isOwner = await RecipesModel.isOwner(parseInt(id), req.usuario.id);
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'No eres el propietario de esta receta' });
      }

      const updateData = {};
      const fields = ['titulo', 'descripcion', 'tiempo_preparacion', 'dificultad', 'categoria_id', 'video_url', 'video_tipo'];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) updateData[f] = req.body[f];
      });

      if (updateData.titulo) {
        updateData.slug = await makeUniqueSlug(getClient(), updateData.titulo, parseInt(id));
      }

      await RecipesModel.update(parseInt(id), updateData);

      const files = req.files || [];
      if (files.length > 0) {
        const existingImages = await RecipesModel.getImagenes(parseInt(id));
        for (const img of existingImages) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
        await RecipesModel.deleteImagenes(parseInt(id));

        for (let i = 0; i < files.length; i++) {
          const result = await uploadToCloudinary(files[i].buffer, {
            folder: 'yum_yum/recipes',
            transformation: { width: 1200, crop: 'limit', quality: 'auto' },
          });
          await RecipesModel.addImagen({
            receta_id: parseInt(id),
            url: result.secure_url,
            public_id: result.public_id,
            orden: i + 1,
          });
        }
      }

      if (req.body.ingredientes) {
        const ingredientes = JSON.parse(req.body.ingredientes);
        await RecipesModel.setIngredientes(parseInt(id), ingredientes);
      }

      if (req.body.pasos) {
        const pasos = JSON.parse(req.body.pasos);
        await RecipesModel.setPasos(parseInt(id), pasos);
      }

      res.json({ success: true, message: 'Receta actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar receta', error: error.message });
    }
  });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const isOwner = await RecipesModel.isOwner(parseInt(id), req.usuario.id);
    if (!isOwner && req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    const imagenes = await RecipesModel.getImagenes(parseInt(id));
    for (const img of imagenes) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await RecipesModel.delete(parseInt(id));
    res.json({ success: true, message: 'Receta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar receta', error: error.message });
  }
});

module.exports = router;
