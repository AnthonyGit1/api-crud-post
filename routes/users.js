const express = require('express');
const router = express.Router();
const {
  createUser,
  activateUser,
  loginUser,
  getAllUsers,
  getUserProfile
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

// POST /api/users - Registrar un nuevo usuario (con avatar opcional)
router.post('/', uploadAvatar, createUser);

// GET /api/users/activate/:token - Activar cuenta de usuario
router.get('/activate/:token', activateUser);

// POST /api/login - Login de usuario
router.post('/login', loginUser);

// GET /api/users - Obtener todos los usuarios (requiere autenticación)
router.get('/', authenticateToken, getAllUsers);

// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;