# API CRUD Posts - Actividad 2

API REST para gestión de posts desarrollado con Express.js y MongoDB en memoria.

## 📋 Descripción

Este proyecto implementa un API CRUD completo para el modelo "Post" con los siguientes endpoints:

- `POST /api/posts` - Crear un nuevo post
- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts/:id` - Obtener un post por ID
- `PATCH /api/posts/:id` - Actualizar un post
- `DELETE /api/posts/:id` - Eliminar un post

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+ 
- npm

### Pasos para ejecutar

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd actividad-2-as
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor**
   ```bash
   npm start
   ```

El servidor se ejecutará en `http://localhost:8000`

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

## 📊 Modelo de Datos

### Post Schema
```javascript
{
  id: String,           // Generado automáticamente
  title: String,        // Requerido, mínimo 6 caracteres
  text: String,         // Requerido, mínimo 6 caracteres  
  author: String,       // Requerido
  createdAt: Date,      // Generado automáticamente
  updatedAt: Date       // Actualizado automáticamente
}
```

## 🛠 API Endpoints

### Health Check
- **GET** `/api/health`
- **Descripción**: Verificar estado del servidor
- **Respuesta**: `200 OK`

### Crear Post
- **POST** `/api/posts`
- **Body**:
  ```json
  {
    "title": "Título del post (mínimo 6 caracteres)",
    "text": "Contenido del post (mínimo 6 caracteres)", 
    "author": "Nombre del autor"
  }
  ```
- **Respuesta**: `201 Created` con el post creado
- **Error**: `400 Bad Request` si hay errores de validación

### Obtener Todos los Posts
- **GET** `/api/posts`
- **Respuesta**: `200 OK` con array de posts

### Obtener Post por ID
- **GET** `/api/posts/:id`
- **Respuesta**: `200 OK` con el post encontrado
- **Error**: `404 Not Found` si el post no existe

### Actualizar Post
- **PATCH** `/api/posts/:id`
- **Body** (campos opcionales):
  ```json
  {
    "title": "Nuevo título",
    "text": "Nuevo contenido",
    "author": "Nuevo autor"
  }
  ```
- **Respuesta**: `200 OK` con el post actualizado
- **Error**: `404 Not Found` si el post no existe

### Eliminar Post
- **DELETE** `/api/posts/:id`
- **Respuesta**: `204 No Content`
- **Error**: `404 Not Found` si el post no existe

## 🧪 Pruebas con Postman

Se incluye la colección `Posts_API_CRUD.postman_collection.json` que contiene:

- ✅ Pruebas para todos los endpoints
- ✅ Casos de éxito y error
- ✅ Tests automáticos de validación
- ✅ Variables de entorno configuradas

### Importar la colección:
1. Abrir Postman
2. Click en "Import"
3. Seleccionar el archivo `Posts_API_CRUD.postman_collection.json`
4. La colección incluye una variable `base_url` configurada para `http://localhost:8000`

## 🏗 Arquitectura del Proyecto

```
actividad-2-as/
├── config/
│   └── db.config.js          # Configuración MongoDB en memoria
├── controllers/
│   └── postController.js     # Lógica de negocio CRUD
├── models/
│   └── Post.js              # Modelo Mongoose
├── routes/
│   └── posts.js             # Rutas del API
├── index.js                 # Servidor Express principal
├── package.json             # Dependencias y scripts
└── Posts_API_CRUD.postman_collection.json  # Colección Postman
```

## 📦 Dependencias

- **express**: Framework web para Node.js
- **mongoose**: ODM para MongoDB
- **mongodb-memory-server**: MongoDB en memoria para desarrollo
- **cors**: Middleware para habilitar CORS

## ⚙️ Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB (en memoria con MongoMemoryServer)
- **ODM**: Mongoose
- **Validación**: Mongoose Schema Validation
- **Testing**: Postman Collection

## 🔍 Funcionalidades Implementadas

- ✅ Modelo Post con validaciones completas
- ✅ API CRUD con todos los endpoints requeridos
- ✅ Manejo de errores apropiado (400, 404, 500)
- ✅ Códigos de estado HTTP correctos
- ✅ Validación de datos de entrada
- ✅ Base de datos en memoria (sin persistencia)
- ✅ Logging de peticiones
- ✅ Middleware de CORS habilitado
- ✅ Colección Postman con tests automáticos
- ✅ Documentación completa

## 🎯 Casos de Uso Cubiertos

1. **Crear post válido** → 201 Created
2. **Crear post inválido** → 400 Bad Request con errores de validación
3. **Listar todos los posts** → 200 OK con array
4. **Obtener post existente** → 200 OK con post
5. **Obtener post inexistente** → 404 Not Found
6. **Actualizar post existente** → 200 OK con post actualizado
7. **Actualizar post inexistente** → 404 Not Found
8. **Eliminar post existente** → 204 No Content
9. **Eliminar post inexistente** → 404 Not Found

## 👥 Autor

Desarrollado para la Actividad 2 del curso de Aplicaciones Servidor.