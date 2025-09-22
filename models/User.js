const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor, ingrese un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'La biografía no puede tener más de 500 caracteres'],
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  activationToken: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para asegurar que el campo id esté disponible
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Virtual para generar URL del avatar
userSchema.virtual('avatarUrl').get(function() {
  if (this.avatar) {
    return `/api/uploads/avatars/${this.avatar}`;
  }
  return null;
});

// Asegurar que los virtuals se incluyan cuando se convierta a JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.activationToken;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;