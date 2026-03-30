const { query } = require('../db/pool');

const getPreguntas = async (req, res) => {
    try {
        const result = await query('SELECT * FROM preguntas_frecuentes ORDER BY creado_en DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener FAQ' });
    }
};

const crearPregunta = async (req, res) => {
    const { categoria, pregunta, palabras_clave, respuesta, activo } = req.body;
    console.log('--- Intentando crear FAQ ---');
    console.log('Datos recibidos:', { categoria, pregunta, palabras_clave, respuesta, activo });

    try {
        const result = await query(
            'INSERT INTO preguntas_frecuentes (categoria, pregunta, palabras_clave, respuesta, activo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [categoria, pregunta, palabras_clave, respuesta, activo]
        );
        console.log('FAQ creada con éxito:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error detallado en crearPregunta:', error.message);
        res.status(500).json({ error: 'Error al crear FAQ: ' + error.message });
    }
};

const eliminarPregunta = async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM preguntas_frecuentes WHERE id = $1', [id]);
        res.json({ message: 'FAQ eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar FAQ' });
    }
};

module.exports = { getPreguntas, crearPregunta, eliminarPregunta };
