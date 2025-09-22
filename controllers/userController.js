const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

/**
 * Registrar un nuevo usuario
 * POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Si hay archivo subido, eliminarlo ya que el registro falló
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    // Cifrar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generar token de activación
    const activationToken = crypto.randomBytes(32).toString('hex');

    // Procesar avatar si se subió
    let avatarFilename = null;
    if (req.file) {
      avatarFilename = req.file.filename;
    }

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bio: bio || '',
      avatar: avatarFilename,
      activationToken: activationToken,
      active: false
    });

    // Guardar en base de datos
    const savedUser = await newUser.save();

    // Generar URL de activación
    const activationUrl = `${req.protocol}://${req.get('host')}/api/users/activate/${activationToken}`;

    res.status(201).json({
      message: 'Usuario creado exitosamente. Por favor, active su cuenta usando el enlace proporcionado.',
      user: savedUser,
      activationUrl: activationUrl
    });
  } catch (error) {
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error eliminando archivo:', unlinkError);
      }
    }

    // Error de validación
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: errors
      });
    }

    // Error de clave duplicada (email único)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Activar cuenta de usuario
 * GET /api/users/activate/:token
 */
const activateUser = async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar usuario por token de activación
    const user = await User.findOne({ activationToken: token });

    if (!user) {
      return res.status(400).json({
        message: 'Token de activación inválido o expirado'
      });
    }

    // Verificar si ya está activo
    if (user.active) {
      return res.status(200).json({
        message: 'La cuenta ya está activada',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          active: user.active
        }
      });
    }

    // Activar el usuario y limpiar el token
    user.active = true;
    user.activationToken = null;
    await user.save();

    res.status(200).json({
      message: 'Cuenta activada exitosamente. Ya puede iniciar sesión.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        activatedAt: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Login de usuario
 * POST /api/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen ambos campos
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar el usuario por email (incluir password para verificación)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(401).json({
        message: 'Usuario inactivo'
      });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa con token
    res.status(200).json({
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener todos los usuarios (opcional, para administración)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ active: true }); // Solo usuarios activos
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  activateUser,
  loginUser,
  getAllUsers,
  getUserProfile
};