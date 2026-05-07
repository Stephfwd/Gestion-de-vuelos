const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Se requiere rol de Administrador' });
  }
};

module.exports = { isAdmin };
