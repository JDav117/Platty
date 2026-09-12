const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { generateTokens } = require('../utils/tokens');
require('dotenv').config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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
