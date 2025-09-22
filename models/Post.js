const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    minlength: [6, 'El título debe tener más de 5 caracteres'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'El texto es requerido'],
    minlength: [6, 'El texto debe tener más de 5 caracteres'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'El autor es requerido'],
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para asegurar que el campo id esté disponible
postSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Asegurar que los virtuals se incluyan cuando se convierta a JSON
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;