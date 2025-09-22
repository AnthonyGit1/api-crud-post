const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

/**
 * Middleware para verificar el token JWT
 * Protege las rutas que requieren autenticación
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token de acceso requerido'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el usuario aún existe y está activo
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({
        message: 'Token inválido o usuario inactivo'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Middleware - continúa sin error si no hay token
 * Para rutas que pueden funcionar con o sin autenticación
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.active) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          name: decoded.name
        };
      }
    }

    next();
  } catch (error) {
    // En caso de error
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};