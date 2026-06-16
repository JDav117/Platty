const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const AuthModel = require('../models/auth.model');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.schema');
const { sendPasswordResetEmail, sendOtpEmail } = require('../utils/emailService');

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    rol: user.rol,
    token_version: user.token_version || 0,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, type: 'refresh' }, SECRET_KEY, { expiresIn: REFRESH_EXPIRES_IN });

  return { token, refreshToken };
};

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const existingUser = await AuthModel.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    const userData = {
      nombre1: req.body.nombre1,
      nombre2: req.body.nombre2 || null,
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2 || null,
      email: req.body.email,
      contraseña: hashedPassword,
      bio: req.body.bio || null,
      rol: 'usuario',
    };

    const user = await AuthModel.create(userData);
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpires = new Date(Date.now() + 600000).toISOString();
    await AuthModel.setOtp(user.id, otpCode, otpExpires);

    try {
      await sendOtpEmail(user.email, otpCode);
    } catch (emailErr) {
      console.error('Error enviando OTP:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
      data: {
        id: user.id,
        nombre1: user.nombre1,
        apellido1: user.apellido1,
        email: user.email,
        rol: user.rol,
        email_verified: false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar usuario', error: error.message });
  }
});

router.post('/verify-otp', authLimiter, async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email y código requeridos' });
    }

    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (user.email_verified) {
      return res.json({ success: true, message: 'El correo ya está verificado' });
    }

    const result = await AuthModel.verifyOtp(user.id, code);
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.reason });
    }

    await AuthModel.markEmailVerified(user.id);
    const tokens = generateTokens({ ...user, token_version: user.token_version || 0 });

    res.json({
      success: true,
      message: 'Correo verificado exitosamente',
      data: {
        id: user.id,
        nombre1: user.nombre1,
        apellido1: user.apellido1,
        email: user.email,
        rol: user.rol,
        email_verified: true,
      },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al verificar código', error: error.message });
  }
});

router.post('/resend-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requerido' });
    }

    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (user.email_verified) {
      return res.json({ success: true, message: 'El correo ya está verificado' });
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpires = new Date(Date.now() + 600000).toISOString();
    await AuthModel.setOtp(user.id, otpCode, otpExpires);

    try {
      await sendOtpEmail(user.email, otpCode);
    } catch (emailErr) {
      console.error('Error reenviando OTP:', emailErr.message);
    }

    res.json({ success: true, message: 'Código reenviado a tu correo' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al reenviar código', error: error.message });
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const user = await AuthModel.findByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Cuenta desactivada. Contacta al soporte' });
    }

    if (!user.email_verified) {
      return res.status(403).json({ success: false, message: 'Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.', code: 'EMAIL_NOT_VERIFIED' });
    }

    const validPassword = await bcrypt.compare(req.body.contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        id: user.id,
        nombre1: user.nombre1,
        apellido1: user.apellido1,
        email: user.email,
        rol: user.rol,
        avatar_url: user.avatar_url,
      },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await AuthModel.findById(req.usuario.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token requerido' });
    }

    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    const user = await AuthModel.findById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado o inactivo' });
    }

    const tokens = generateTokens({ ...user, token_version: 0 });
    res.json({ success: true, ...tokens });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Refresh token inválido o expirado' });
  }
});

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), async (req, res) => {
  try {
    const user = await AuthModel.findByEmail(req.body.email);
    if (!user) {
      return res.json({ success: true, message: 'Si el email existe, recibirás un enlace de recuperación' });
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    await AuthModel.setResetToken(req.body.email, resetToken, expiresAt);

    try {
      await sendPasswordResetEmail(req.body.email, resetToken);
    } catch (emailErr) {
      console.error('Error enviando email:', emailErr.message);
    }

    res.json({ success: true, message: 'Si el email existe, recibirás un enlace de recuperación' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al procesar solicitud', error: error.message });
  }
});

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const user = await AuthModel.findByResetToken(req.body.token);
    if (!user || !user.reset_expires || new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    await AuthModel.updatePassword(user.id, hashedPassword);
    await AuthModel.clearResetToken(user.id);

    res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al restablecer contraseña', error: error.message });
  }
});

module.exports = router;
