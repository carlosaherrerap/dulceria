const { query } = require('../db/pool');

/**
 * Obtener lista de contactos (usuarios finales)
 */
const getContactos = async (req, res) => {
    try {
        const result = await query('SELECT id, nombre, telefono, email, creado_en FROM usuarios ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
};

/**
 * Crear contacto manual
 */
const crearContacto = async (req, res) => {
    const { nombre, telefono, email } = req.body;
    try {
        const result = await query(
            'INSERT INTO usuarios (nombre, telefono, email) VALUES ($1, $2, $3) RETURNING *',
            [nombre, telefono, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear contacto' });
    }
};

/**
 * Eliminar contacto
 */
const eliminarContacto = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ message: 'Contacto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar contacto' });
    }
};

module.exports = {
    getContactos,
    crearContacto,
    eliminarContacto
};
