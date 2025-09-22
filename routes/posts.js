const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');

const { authenticateToken } = require('../middleware/auth');

// POST /api/posts - Crear un nuevo post (requiere autenticación)
router.post('/', authenticateToken, createPost);

// GET /api/posts - Obtener todos los posts (requiere autenticación)
router.get('/', authenticateToken, getAllPosts);

// GET /api/posts/:id - Obtener un post por ID (requiere autenticación)
router.get('/:id', authenticateToken, getPostById);

// PATCH /api/posts/:id - Actualizar un post (requiere autenticación)
router.patch('/:id', authenticateToken, updatePost);

// DELETE /api/posts/:id - Eliminar un post (requiere autenticación)
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;