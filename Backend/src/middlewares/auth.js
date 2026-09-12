const jwt = require('jsonwebtoken');
const { getClient } = require('../config/db');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }

  // Un token de refresco está firmado con la misma clave, así que sin esta
  // comprobación servía también como token de acceso.
  if (decoded.type === 'refresh') {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }

  try {
    // Un JWT no se puede revocar por sí solo: hay que contrastar contra la BD
    // el token_version con el que se emitió y el estado de la cuenta.
    const { data: usuario, error } = await getClient()
      .from('usuarios')
      .select('id, email, rol, is_active, token_version')
      .eq('id', decoded.id)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (!usuario.is_active) {
      return res.status(403).json({ success: false, message: 'Cuenta desactivada. Contacta al soporte' });
    }

    if ((decoded.token_version || 0) !== (usuario.token_version || 0)) {
      return res.status(401).json({
        success: false,
        message: 'Sesión cerrada. Vuelve a iniciar sesión',
        code: 'TOKEN_REVOKED',
      });
    }

    // El rol sale de la BD, no del token: un cambio de rol surte efecto sin
    // esperar a que expire el JWT.
    req.usuario = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      token_version: usuario.token_version,
    };
    next();
  } catch (err) {
    console.error('Error validando sesión:', err.message);
    return res.status(500).json({ success: false, message: 'Error al validar la sesión' });
  }
};

module.exports = authMiddleware;
