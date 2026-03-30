const { query } = require('../db/pool');

/**
 * Obtener todas las reservas
 */
const getReservas = async (req, res) => {
    try {
        const result = await query(`
      SELECT r.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono
      FROM reservas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.creado_en DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
};

/**
 * Actualizar estado de una reserva
 */
const actualizarEstadoReserva = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const result = await query(
            'UPDATE reservas SET estado = $1, actualizado_en = now() WHERE id = $2 RETURNING *',
            [estado, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar estado de reserva' });
    }
};

module.exports = {
    getReservas,
    actualizarEstadoReserva
};
