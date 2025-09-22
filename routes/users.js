const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserProfile
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/auth');

// POST /api/users - Registrar un nuevo usuario
router.post('/', createUser);

// POST /api/login - Login de usuario
router.post('/login', loginUser);

// GET /api/users - Obtener todos los usuarios (requiere autenticación)
router.get('/', authenticateToken, getAllUsers);

// GET /api/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;