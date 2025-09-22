# API CRUD Posts con Autenticación

API REST desarrollada con Express.js y MongoDB (en memoria) que implementa un sistema CRUD completo para Posts con autenticación de usuarios mediante JWT (JSON Web Tokens).

## 🚀 Características

- ✅ CRUD completo para Posts (Crear, Leer, Actualizar, Eliminar)
- 🔐 Sistema de autenticación con JWT
- 👤 Gestión de usuarios (registro y login)
- 🔒 Protección de endpoints con middleware de autenticación
- 📝 Validación de datos con Mongoose
- 🔑 Cifrado de contraseñas con bcryptjs
- 💾 Base de datos MongoDB en memoria
- 📮 Colección Postman incluida para testing

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL (en memoria)
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Librería para cifrado de contraseñas
- **jsonwebtoken** - Implementación de JWT para Node.js
- **CORS** - Middleware para habilitar CORS

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## ⚡ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/api-crud-post.git
cd api-crud-post
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:8000`

## 📚 Endpoints de la API

### 🔐 Autenticación

#### Registrar Usuario
```http
POST /api/users
Content-Type: application/json

{
    "name": "Juan Pérez",
    "email": "juan.perez@ejemplo.com",
    "password": "123456",
    "bio": "Desarrollador de software" (opcional)
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
    "email": "juan.perez@ejemplo.com",
    "password": "123456"
}
```

**Respuesta exitosa:**
```json
{
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "...",
        "name": "Juan Pérez",
        "email": "juan.perez@ejemplo.com",
        "bio": "Desarrollador de software",
        "active": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

#### Obtener Perfil del Usuario
```http
GET /api/users/profile
Authorization: Bearer <token_jwt>
```

#### Listar Usuarios
```http
GET /api/users
Authorization: Bearer <token_jwt>
```

### 📝 Posts (Todos requieren autenticación)

Todos los endpoints de Posts requieren incluir el token JWT en el header:
```
Authorization: Bearer <token_jwt>
```

#### Crear Post
```http
POST /api/posts
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
    "title": "Mi primer post",
    "text": "Contenido del post",
    "author": "Juan Pérez"
}
```

#### Obtener Todos los Posts
```http
GET /api/posts
Authorization: Bearer <token_jwt>
```

#### Obtener Post por ID
```http
GET /api/posts/:id
Authorization: Bearer <token_jwt>
```

#### Actualizar Post
```http
PATCH /api/posts/:id
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
    "title": "Título actualizado",
    "text": "Contenido actualizado"
}
```

#### Eliminar Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token_jwt>
```

### 🏥 Sistema

#### Health Check
```http
GET /api/health
```

## 📊 Modelo de Datos

### Usuario
```javascript
{
    id: String,
    name: String (requerido, 2-50 caracteres),
    email: String (requerido, único, formato email),
    password: String (requerido, mínimo 6 caracteres, cifrado),
    bio: String (opcional, máximo 500 caracteres),
    active: Boolean (default: false),
    createdAt: Date,
    updatedAt: Date
}
```

### Post
```javascript
{
    id: String,
    title: String (requerido, mínimo 6 caracteres),
    text: String (requerido, mínimo 6 caracteres),
    author: String (requerido),
    createdAt: Date,
    updatedAt: Date
}
```

## 🔒 Seguridad

- **Cifrado de contraseñas**: Las contraseñas se cifran usando bcryptjs con salt de 10 rounds
- **JWT**: Los tokens tienen una duración de 24 horas
- **Validación de entrada**: Todos los datos se validan usando esquemas de Mongoose
- **Protección de endpoints**: Todos los endpoints de Posts requieren autenticación
- **Headers seguros**: Implementación de CORS

## 🔑 Autenticación JWT

1. **Registro**: El usuario se registra con email, contraseña y datos personales
2. **Login**: El usuario envía credenciales y recibe un token JWT
3. **Autorización**: El token debe incluirse en el header `Authorization: Bearer <token>`
4. **Validación**: El middleware verifica el token en cada petición protegida

### Formato del Token
El token incluye la siguiente información:
```javascript
{
    userId: "...",
    email: "usuario@ejemplo.com",
    name: "Usuario",
    exp: 1640995200 // Expiration timestamp
}
```

## 📮 Testing con Postman

1. Importa la colección `Posts_API_CRUD_Auth.postman_collection.json` en Postman
2. La colección incluye:
   - Variables de entorno pre-configuradas
   - Scripts automáticos para guardar el token JWT
   - Ejemplos de todas las peticiones
   - Documentación de cada endpoint

### Variables de Entorno
- `base_url`: http://localhost:8000
- `auth_token`: Se guarda automáticamente al hacer login
- `post_id`: Para usar en operaciones con posts específicos
- `user_id`: ID del usuario autenticado

## 🚦 Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error de validación o datos incorrectos
- **401 Unauthorized**: Token faltante, inválido o expirado
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## 🛠️ Desarrollo

### Scripts disponibles
```bash
npm start        # Inicia el servidor en producción
npm run dev      # Inicia el servidor en modo desarrollo (nodemon)
```

### Estructura del proyecto
```
├── config/
│   └── db.config.js         # Configuración de MongoDB
├── controllers/
│   ├── postController.js    # Controladores de Posts
│   └── userController.js    # Controladores de Usuarios
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── models/
│   ├── Post.js              # Modelo de Post
│   └── User.js              # Modelo de Usuario
├── routes/
│   ├── posts.js             # Rutas de Posts
│   └── users.js             # Rutas de Usuarios
├── index.js                 # Punto de entrada de la aplicación
├── package.json
└── README.md
```

## 🔧 Variables de Entorno (Opcionales)

Puedes crear un archivo `.env` para configurar:
```env
PORT=8000
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

## � Notas Importantes

1. **Base de datos en memoria**: Los datos se pierden al reiniciar el servidor
2. **Clave JWT**: En producción, usar una clave secreta segura en variables de entorno
3. **HTTPS**: En producción, usar HTTPS para proteger los tokens
4. **Validación**: Todos los campos tienen validaciones del lado del servidor
5. **Contraseñas**: Se cifran automáticamente antes de guardar en la base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado como parte del ejercicio de programación de APIs con autenticación.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!