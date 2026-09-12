const authMiddleware = require('./auth');

const isAdmin = (req, res, next) => {
  // authMiddleware es async y responde por su cuenta ante cualquier fallo:
  // este callback sólo corre cuando la sesión ya quedó validada.
  Promise.resolve(
    authMiddleware(req, res, () => {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol de administrador' });
      }
      next();
    })
  ).catch(next);
};

module.exports = isAdmin;
