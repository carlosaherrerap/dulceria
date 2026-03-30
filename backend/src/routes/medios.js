const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { query } = require('../db/pool');

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ruta para subir archivos (imágenes para productos, PDFs para boletas, etc.)
router.post('/upload', auth, upload.single('archivo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const { tipo } = req.body; // 'imagen', 'pdf', etc.
    const ruta = req.file.path;

    try {
        const result = await query(
            'INSERT INTO medios (id, tipo, ruta) VALUES ($1, $2, $3) RETURNING *',
            [req.file.filename, tipo || 'general', ruta]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar medio en la base de datos' });
    }
});

module.exports = router;
