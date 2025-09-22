const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController');

// POST /api/posts - Crear un nuevo post
router.post('/', createPost);

// GET /api/posts - Obtener todos los posts
router.get('/', getAllPosts);

// GET /api/posts/:id - Obtener un post por ID
router.get('/:id', getPostById);

// PATCH /api/posts/:id - Actualizar un post
router.patch('/:id', updatePost);

// DELETE /api/posts/:id - Eliminar un post
router.delete('/:id', deletePost);

module.exports = router;