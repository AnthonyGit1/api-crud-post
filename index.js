const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db.config');
const postRoutes = require('./routes/posts');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/posts', postRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 API endpoints disponibles:`);
      console.log(`   GET    /api/health`);
      console.log(`   POST   /api/posts`);
      console.log(`   GET    /api/posts`);
      console.log(`   GET    /api/posts/:id`);
      console.log(`   PATCH  /api/posts/:id`);
      console.log(`   DELETE /api/posts/:id`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...');
  const { disconnectDB } = require('./config/db.config');
  await disconnectDB();
  process.exit(0);
});

// Iniciar el servidor
startServer();

module.exports = app;