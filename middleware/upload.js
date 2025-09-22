const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el directorio de uploads
const uploadsDir = path.join(__dirname, '../uploads/avatars');

// Asegurar que el directorio existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único con timestamp y extensión original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + extension);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Solo permitir imágenes
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1
  }
});

// Middleware para manejar un solo archivo avatar
const uploadAvatar = upload.single('avatar');

// Middleware personalizado para manejar errores de multer
const handleMulterError = (req, res, next) => {
  uploadAvatar(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'El archivo es demasiado grande. Máximo 5MB permitido.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          message: 'Solo se permite un archivo por petición.'
        });
      }
      return res.status(400).json({
        message: 'Error al procesar el archivo: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message
      });
    }
    next();
  });
};

module.exports = {
  uploadAvatar: handleMulterError,
  uploadsDir
};