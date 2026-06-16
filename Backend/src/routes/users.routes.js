const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const AuthModel = require('../models/auth.model');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateProfileSchema, changePasswordSchema } = require('../validations/auth.schema');
const { upload, uploadToCloudinary, uploadSingleImage, handleUploadError } = require('../middlewares/upload');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await AuthModel.findById(req.usuario.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener perfil', error: error.message });
  }
});

router.put('/profile', authMiddleware, validate(updateProfileSchema), async (req, res) => {
  try {
    const updateData = {};
    const fields = ['nombre1', 'nombre2', 'apellido1', 'apellido2', 'bio', 'email'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    if (updateData.email) {
      const existing = await AuthModel.findByEmail(updateData.email);
      if (existing && existing.id !== req.usuario.id) {
        return res.status(409).json({ success: false, message: 'El email ya está en uso' });
      }
    }

    const user = await AuthModel.update(req.usuario.id, updateData);
    res.json({ success: true, message: 'Perfil actualizado', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar perfil', error: error.message });
  }
});

router.put('/avatar', authMiddleware, (req, res, next) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se proporcionó imagen' });
      }

      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'La imagen no puede superar los 10MB' });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'yum_yum/avatars',
        transformation: { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      });

      const user = await AuthModel.update(req.usuario.id, { avatar_url: result.secure_url });
      res.json({ success: true, message: 'Avatar actualizado', data: { avatar_url: user.avatar_url } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al subir avatar', error: error.message });
    }
  });
});

router.put('/password', authMiddleware, validate(changePasswordSchema), async (req, res) => {
  try {
    const user = await AuthModel.findByEmail(req.usuario.email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(req.body.contraseñaActual, user.contraseña);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(req.body.nuevaContraseña, 10);
    await AuthModel.updatePassword(req.usuario.id, hashedPassword);

    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña', error: error.message });
  }
});

router.post('/close-sessions', authMiddleware, async (req, res) => {
  try {
    await AuthModel.incrementTokenVersion(req.usuario.id);
    res.json({ success: true, message: 'Sesiones cerradas en otros dispositivos' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cerrar sesiones', error: error.message });
  }
});

router.post('/deactivate', authMiddleware, async (req, res) => {
  try {
    await AuthModel.deactivate(req.usuario.id);
    res.json({ success: true, message: 'Cuenta desactivada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al desactivar cuenta', error: error.message });
  }
});

router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const { contraseña } = req.body;
    if (!contraseña) {
      return res.status(400).json({ success: false, message: 'Debes proporcionar tu contraseña para eliminar la cuenta' });
    }

    const user = await AuthModel.findByEmail(req.usuario.email);
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    await AuthModel.hardDelete(req.usuario.id);
    res.json({ success: true, message: 'Cuenta eliminada definitivamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar cuenta', error: error.message });
  }
});

module.exports = router;
