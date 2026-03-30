const { query } = require('../db/pool');

const getClientes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM usuarios ORDER BY creado_en DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

const crearCliente = async (req, res) => {
    const { nombre, codigo, telefono, email } = req.body;
    console.log('--- Intentando crear cliente ---');
    console.log('Datos recibidos:', { nombre, codigo, telefono, email });

    try {
        const result = await query(
            'INSERT INTO usuarios (nombre, codigo, telefono, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, codigo, telefono, email]
        );
        console.log('Cliente creado con éxito:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error detallado en crearCliente:', error.message);
        res.status(500).json({ error: 'Error al crear cliente: ' + error.message });
    }
};

module.exports = {
    getClientes,
    crearCliente
};
