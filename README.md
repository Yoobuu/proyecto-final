# Biblioteca USFQ

Este proyecto es una aplicación web para gestionar libros en una biblioteca. Incluye un backend desarrollado con Node.js y Express, y un frontend desarrollado con HTML, CSS y JavaScript.

## Tecnologías utilizadas
- **Backend**: Node.js, Express, PostgreSQL.
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap.
- **Autenticación**: No implementada en esta versión.
- **Notificaciones**: No implementadas en esta versión.

## Configuración
### Backend
1. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Configurar las credenciales en un archivo `.env` en el directorio `backend`:
   ```env
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=biblioteca
   DB_HOST=localhost
   DB_PORT=5432
   ```
3. Iniciar el servidor:
   ```bash
   node app.js
   ```

### Frontend
1. Abre el archivo `frontend/index.html` en tu navegador.

## Uso
- Accede a la URL donde el frontend está alojado.
- Interactúa con la aplicación para agregar, editar y eliminar libros.
