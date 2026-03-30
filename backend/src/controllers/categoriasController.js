const { query } = require('../db/pool');

const getCategorias = async (req, res) => {
    try {
        const result = await query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const crearCategoria = async (req, res) => {
    const { id, nombre, descripcion } = req.body;
    try {
        const result = await query(
            'INSERT INTO categorias (id, nombre, descripcion) VALUES ($1, $2, $3) RETURNING *',
            [id, nombre, descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

module.exports = { getCategorias, crearCategoria };
