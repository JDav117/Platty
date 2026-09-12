const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Ambos tokens llevan el token_version con el que fueron emitidos. El
// middleware de auth lo contrasta contra la BD, así que incrementarlo
// (cerrar sesiones, cambiar contraseña, desactivar cuenta) invalida de
// inmediato los tokens ya repartidos, incluido el de refresco.
const generateTokens = (user) => {
  const version = user.token_version || 0;

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol, token_version: version },
    SECRET_KEY,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh', token_version: version },
    SECRET_KEY,
    { expiresIn: REFRESH_EXPIRES_IN }
  );

  return { token, refreshToken };
};

// Math.random no es criptográficamente seguro: un OTP de 6 dígitos generado
// así es predecible para quien logre inferir el estado del PRNG.
const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const OTP_TTL_MS = 10 * 60 * 1000;

module.exports = { generateTokens, generateOtp, OTP_TTL_MS };
