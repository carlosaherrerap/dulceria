const express = require('express');
const cors = require('cors');
const { pool } = require('./src/db/pool');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');

// Asegurar que la carpeta de uploads exista
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./src/routes/auth');
const productosRoutes = require('./src/routes/productos');
const reservasRoutes = require('./src/routes/reservas');
const clientesRoutes = require('./src/routes/clientes');
const preguntasRoutes = require('./src/routes/preguntas');
const sugerenciasRoutes = require('./src/routes/sugerencias');
const anunciosRoutes = require('./src/routes/anuncios');
const contactosRoutes = require('./src/routes/contactos');
const mediosRoutes = require('./src/routes/medios');
const categoriasRoutes = require('./src/routes/categorias');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/sugerencias', sugerenciasRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/contactos', contactosRoutes);
app.use('/api/medios', mediosRoutes);
app.use('/api/categorias', categoriasRoutes);

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'API de la Pastelería Renzos activa' });
});

// Inicialización del Bot
const { initWhatsApp } = require('./src/bot/whatsapp');
initWhatsApp();

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
