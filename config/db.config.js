const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

/**
 * Conecta a una instancia de MongoDB en memoria
 */
const connectDB = async () => {
  try {
    // Crear una nueva instancia de MongoMemoryServer
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Configurar opciones de conexión
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Conectar a MongoDB
    await mongoose.connect(uri, mongooseOpts);
    console.log('✅ Conectado a MongoDB en memoria');
    console.log(`📍 URI de base de datos: ${uri}`);

  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

/**
 * Desconecta de la base de datos y detiene el servidor en memoria
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    console.log('✅ Desconectado de MongoDB en memoria');
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error);
  }
};

/**
 * Limpia la base de datos eliminando todas las colecciones
 */
const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('🧹 Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  clearDB
};