# Sistema Pastelería Renzos 🍰

Este proyecto integra un **Bot de WhatsApp con IA (DeepSeek)**, una **API Backend (Node.js)** y un **Portal de Administración** para empleados.

## 🚀 Despliegue Rápido

1.  **Requisitos**: Docker y Docker Compose instalados.
2.  **Configuración**: Asegúrate de que el archivo `.env` en la carpeta `backend` tenga tu `DEEPSEEK_API_KEY`.
3.  **Iniciar**:
    ```powershell
    docker-compose up --build -d
    ```
4.  **Vincular WhatsApp**:
    Revisa los logs para escanear el código QR:
    ```powershell
    docker logs -f dulceria-backend
    ```

---

## 👥 Manual del Portal de Empleados

El portal permite gestionar la operación diaria de la pastelería.

### 1. Acceso (Login)
- Abre `frontend/index.html` en tu navegador.
- **Credenciales semilla**:
  - **Email**: `admin@renzos.com`
  - **Contraseña**: `admin2026`
- El sistema utiliza tokens JWT para mantener la sesión segura.

### 2. Gestión de Productos (📦)
- **Visualización**: Lista de todos los productos, categorías y estados (activo/inactivo).
- **Acciones**: Puedes agregar nuevos postres, editar presentaciones (tamaños, precios) y eliminar productos obsoletos.

### 3. Reservas y Pedidos (🗓️)
- **Seguimiento**: Todas las reservas creadas por el bot de WhatsApp aparecen aquí automáticamente.
- **Flujo de Estados**: Puedes cambiar el estado de un pedido usando el selector en la tabla:
  - `PENDIENTE`: Recién recibido.
  - `EJECUTANDO`: En preparación en cocina.
  - `TERMINADO`: Listo para ser recogido/enviado.
  - `ENTREGADO`: Cliente ya recibió su producto.

### 4. FAQ y Reclamos (❓)
- Aquí configuras la "memoria" del bot.
- Si detectas que el bot no sabe responder algo, agrega una nueva pregunta con sus palabras clave y la respuesta deseada. El bot aprenderá inmediatamente.

### 5. Anuncios Masivos (📢)
- Selecciona clientes de tu base de datos.
- Escribe un mensaje (ej: "¡Promoción de fin de semana!").
- Haz clic en **Enviar a WhatsApp** y el bot notificará a todos automáticamente.

---

## 🛠️ Documentación de la API (Técnica)

La API corre en el puerto `3000`. Todas las rutas (excepto login) requieren la cabecera `Authorization: Bearer <token>`.

### Autenticación
- `POST /api/auth/login`: Retorna el token y datos del usuario.

### Productos
- `GET /api/productos`: Lista completa de productos.
- `POST /api/productos`: Crea un nuevo producto.

### Reservas
- `GET /api/reservas`: Lista todas las reservas con datos del cliente.
- `PUT /api/reservas/:id/estado`: Cambia el estado (`PENDIENTE`, `EJECUTANDO`, etc.).

### Clientes y Contactos
- `GET /api/contactos`: Lista de usuarios registrados por el bot.
- `POST /api/contactos`: Registro manual de clientes.

### Marketing y Otros
- `POST /api/anuncios/enviar`: Envía mensajes masivos.
- `POST /api/medios/upload`: Sube imágenes/PDFs para el bot.

---

## 📂 Estructura del Proyecto

- `backend/sr/bot`: Lógica de Baileys, Flujo de fases e integración con WhatsApp.
- `backend/src/services`: Conexión con DeepSeek API.
- `frontend/`: Archivos estáticos del portal de empleados.
- `schema.sql`: Definición de la base de datos PostgreSQL en español.
