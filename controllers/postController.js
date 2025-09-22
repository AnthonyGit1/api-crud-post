const Post = require('../models/Post');

/**
 * Crear un nuevo post
 * POST /api/posts
 */
const createPost = async (req, res) => {
  try {
    const { title, text, author } = req.body;

    // Crear el nuevo post
    const newPost = new Post({
      title,
      text,
      author
    });

    // Guardar en base de datos
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    // Error de validación
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: errors
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener todos los posts
 * GET /api/posts
 */
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener un post por ID
 * GET /api/posts/:id
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    res.status(200).json(post);
  } catch (error) {
    // Error de ID inválido
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Actualizar un post
 * PATCH /api/posts/:id
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Buscar y actualizar el post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Devolver el documento actualizado
        runValidators: true // Ejecutar validaciones del esquema
      }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    // Error de ID inválido
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    // Error de validación
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: errors
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Eliminar un post
 * DELETE /api/posts/:id
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    res.status(204).send(); // No Content
  } catch (error) {
    // Error de ID inválido
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};