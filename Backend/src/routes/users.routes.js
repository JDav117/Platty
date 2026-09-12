const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const AuthModel = require('../models/auth.model');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { changePasswordSchema } = require('../validations/auth.schema');
const { updateProfileSchema } = require('../validations/user.schema');
const { uploadToCloudinary, uploadSingleImage, handleUploadError } = require('../middlewares/upload');
const { generateTokens, generateOtp, OTP_TTL_MS } = require('../utils/tokens');
const { sendOtpEmail } = require('../utils/emailService');
const { serverError } = require('../utils/helpers');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await AuthModel.findById(req.usuario.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    serverError(res, 'Error al obtener perfil', error);
  }
});

router.put('/profile', authMiddleware, validate(updateProfileSchema), async (req, res) => {
  try {
    const updateData = {};
    const fields = ['nombre1', 'nombre2', 'apellido1', 'apellido2', 'bio', 'email'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const actual = await AuthModel.findById(req.usuario.id);
    if (!actual) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const cambiaEmail = Boolean(updateData.email) && updateData.email !== actual.email;

    if (cambiaEmail) {
      const existing = await AuthModel.findByEmail(updateData.email);
      if (existing && existing.id !== req.usuario.id) {
        return res.status(409).json({ success: false, message: 'El email ya está en uso' });
      }
      // El correo nuevo todavía no está probado: sin reiniciar la verificación,
      // bastaba con registrarse desde un dominio permitido y luego mudarse.
      updateData.email_verified = false;
    } else {
      delete updateData.email;
    }

    const user = await AuthModel.update(req.usuario.id, updateData);

    if (cambiaEmail) {
      const otpCode = generateOtp();
      await AuthModel.setOtp(user.id, otpCode, new Date(Date.now() + OTP_TTL_MS).toISOString());
      try {
        await sendOtpEmail(user.email, otpCode);
      } catch (emailErr) {
        console.error('Error enviando OTP:', emailErr.message);
      }
      return res.json({
        success: true,
        message: 'Perfil actualizado. Verifica tu nuevo correo con el código que te enviamos.',
        emailVerificationRequired: true,
        data: user,
      });
    }

    res.json({ success: true, message: 'Perfil actualizado', data: user });
  } catch (error) {
    serverError(res, 'Error al actualizar perfil', error);
  }
});

router.put('/avatar', authMiddleware, (req, res, next) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) return handleUploadError(err, req, res, next);
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se proporcionó imagen' });
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'yum_yum/avatars',
        transformation: { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      });

      const user = await AuthModel.update(req.usuario.id, { avatar_url: result.secure_url });
      res.json({ success: true, message: 'Avatar actualizado', data: { avatar_url: user.avatar_url } });
    } catch (error) {
      serverError(res, 'Error al subir avatar', error);
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

    // Cambiar la contraseña cierra las demás sesiones. Se reemiten tokens para
    // no expulsar al dispositivo desde el que se hizo el cambio.
    await AuthModel.incrementTokenVersion(req.usuario.id);
    const actualizado = await AuthModel.findById(req.usuario.id);
    const tokens = generateTokens(actualizado);

    res.json({ success: true, message: 'Contraseña actualizada exitosamente', ...tokens });
  } catch (error) {
    serverError(res, 'Error al cambiar contraseña', error);
  }
});

router.post('/close-sessions', authMiddleware, async (req, res) => {
  try {
    await AuthModel.incrementTokenVersion(req.usuario.id);
    // El incremento invalida también el token de este dispositivo, así que se
    // reemite: "cerrar en otros dispositivos" no debe cerrar el actual.
    const actualizado = await AuthModel.findById(req.usuario.id);
    const tokens = generateTokens(actualizado);
    res.json({ success: true, message: 'Sesiones cerradas en otros dispositivos', ...tokens });
  } catch (error) {
    serverError(res, 'Error al cerrar sesiones', error);
  }
});

router.post('/deactivate', authMiddleware, async (req, res) => {
  try {
    await AuthModel.deactivate(req.usuario.id);
    // Invalida también los tokens de refresco ya emitidos.
    await AuthModel.incrementTokenVersion(req.usuario.id);
    res.json({ success: true, message: 'Cuenta desactivada exitosamente' });
  } catch (error) {
    serverError(res, 'Error al desactivar cuenta', error);
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
    serverError(res, 'Error al eliminar cuenta', error);
  }
});

module.exports = router;
