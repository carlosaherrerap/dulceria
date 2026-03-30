const { query } = require('../db/pool');

const getSugerencias = async (req, res) => {
    try {
        const result = await query('SELECT * FROM sugerencias_mixtas ORDER BY creado_en DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener sugerencias' });
    }
};

const crearSugerencia = async (req, res) => {
    const { ocasion, palabras_clave, descripcion, presentaciones_ids, precio_estimado, activo } = req.body;
    console.log('--- Intentando crear sugerencia ---');
    console.log('Datos recibidos:', { ocasion, palabras_clave, descripcion, presentaciones_ids, precio_estimado, activo });

    try {
        const result = await query(
            'INSERT INTO sugerencias_mixtas (ocasion, palabras_clave, descripcion, presentaciones_ids, precio_estimado, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [ocasion, palabras_clave, descripcion, JSON.stringify(presentaciones_ids || []), precio_estimado, activo]
        );
        console.log('Sugerencia creada con éxito:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error detallado en crearSugerencia:', error.message);
        res.status(500).json({ error: 'Error al crear sugerencia: ' + error.message });
    }
};

module.exports = { getSugerencias, crearSugerencia };
