const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthModel = require('../models/auth.model');
const { getClient } = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false, { message: 'No se pudo obtener el email de Google' });

    const nombre1 = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'Usuario';
    const apellido1 = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '';

    let user = await AuthModel.findByEmail(email);

    if (!user) {
      const supabase = getClient();
      const { data: newUser, error } = await supabase
        .from('usuarios')
        .insert({
          nombre1,
          apellido1: apellido1 || 'Google',
          email,
          contraseña: '',
          avatar_url: profile.photos?.[0]?.value || null,
          rol: 'usuario',
          email_verified: true,
        })
        .select('id, nombre1, apellido1, email, rol, avatar_url')
        .single();
      if (error) throw error;
      user = newUser;
    } else if (!user.avatar_url && profile.photos?.[0]?.value) {
      await AuthModel.update(user.id, { avatar_url: profile.photos[0].value });
    }
    // Verificar que el email esté marcado como verificado
    if (!user.email_verified) {
      await AuthModel.markEmailVerified(user.id);
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
