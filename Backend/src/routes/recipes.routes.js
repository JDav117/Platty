const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const RecipesModel = require('../models/recipes.model');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRecipeSchema, updateRecipeSchema } = require('../validations/recipe.schema');
const { uploadToCloudinary, uploadImages, handleUploadError } = require('../middlewares/upload');
const { makeUniqueSlug } = require('../utils/generateSlug');
const { getClient } = require('../config/db');
const { serverError } = require('../utils/helpers');

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
    serverError(res, 'Error al obtener recetas', error);
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
    serverError(res, 'Error al obtener recetas del usuario', error);
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
    serverError(res, 'Error al obtener receta', error);
  }
});

router.post('/', authMiddleware, (req, res, next) => {
  uploadImages(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    try {
      const { error: valError, value: datos } = createRecipeSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (valError) {
        const messages = valError.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: 'Error de validación', errors: messages });
      }

      const files = req.files || [];
      if (files.length > 5) {
        return res.status(400).json({ success: false, message: 'Máximo 5 imágenes' });
      }

      // datos viene de createRecipeSchema: los numeros ya estan convertidos
      // e ingredientes/pasos ya son arrays parseados desde el string JSON.
      const slug = await makeUniqueSlug(getClient(), datos.titulo);
      const recetaData = {
        usuario_id: req.usuario.id,
        titulo: datos.titulo,
        slug,
        descripcion: datos.descripcion,
        tiempo_preparacion: datos.tiempo_preparacion,
        dificultad: datos.dificultad,
        categoria_id: datos.categoria_id,
        video_url: datos.video_url || null,
        video_tipo: datos.video_tipo || null,
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

      await RecipesModel.setIngredientes(receta.id, datos.ingredientes);
      await RecipesModel.setPasos(receta.id, datos.pasos);

      res.status(201).json({
        success: true,
        message: 'Receta creada exitosamente',
        data: { id: receta.id, slug: receta.slug },
      });
    } catch (error) {
      serverError(res, 'Error al crear receta', error);
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

      const { error: valError, value: datos } = updateRecipeSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (valError) {
        const messages = valError.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: 'Error de validación', errors: messages });
      }

      const updateData = {};
      const fields = ['titulo', 'descripcion', 'tiempo_preparacion', 'dificultad', 'categoria_id', 'video_url', 'video_tipo'];
      fields.forEach((f) => {
        if (datos[f] !== undefined) updateData[f] = datos[f];
      });

      // El formulario envía cadena vacía para quitar un video ya guardado;
      // en la tabla eso debe quedar como NULL, no como ''.
      if (updateData.video_url === '') updateData.video_url = null;
      if (updateData.video_tipo === '') updateData.video_tipo = null;

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

      if (datos.ingredientes) {
        await RecipesModel.setIngredientes(parseInt(id), datos.ingredientes);
      }

      if (datos.pasos) {
        await RecipesModel.setPasos(parseInt(id), datos.pasos);
      }

      res.json({ success: true, message: 'Receta actualizada exitosamente' });
    } catch (error) {
      serverError(res, 'Error al actualizar receta', error);
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
    serverError(res, 'Error al eliminar receta', error);
  }
});

module.exports = router;
