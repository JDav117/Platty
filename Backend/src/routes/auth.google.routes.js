const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, rol: user.rol, token_version: user.token_version || 0 };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, type: 'refresh' }, SECRET_KEY, { expiresIn: '7d' });
  return { token, refreshToken };
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed` }), (req, res) => {
  const { token, refreshToken } = generateTokens(req.user);
  const userData = encodeURIComponent(JSON.stringify({
    id: req.user.id, nombre1: req.user.nombre1, apellido1: req.user.apellido1,
    email: req.user.email, rol: req.user.rol, avatar_url: req.user.avatar_url,
  }));
  res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}&refreshToken=${refreshToken}&user=${userData}`);
});

module.exports = router;
