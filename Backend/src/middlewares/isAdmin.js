const authMiddleware = require('./auth');

const isAdmin = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol de administrador' });
    }
    next();
  });
};

module.exports = isAdmin;
