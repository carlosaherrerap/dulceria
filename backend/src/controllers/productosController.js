const { query } = require('../db/pool');

/**
 * Obtener todos los productos con su categoría
 */
const getProductos = async (req, res) => {
    try {
        const result = await query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.creado_en DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

/**
 * Crear un nuevo producto
 */
const crearProducto = async (req, res) => {
    const { id, nombre, descripcion, categoria_id, activo } = req.body;
    console.log('--- Intentando crear producto ---');
    console.log('Datos recibidos:', { id, nombre, descripcion, categoria_id, activo });

    try {
        const result = await query(
            'INSERT INTO productos (id, nombre, descripcion, categoria_id, activo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, nombre, descripcion, categoria_id, activo]
        );
        console.log('Producto creado con éxito:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error detallado en crearProducto:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Error al crear producto: ' + error.message });
    }
};

/**
 * Actualizar un producto
 */
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, categoria_id, activo } = req.body;
    try {
        const result = await query(
            'UPDATE productos SET nombre = $1, descripcion = $2, categoria_id = $3, activo = $4 WHERE id = $5 RETURNING *',
            [nombre, descripcion, categoria_id, activo, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

/**
 * Eliminar un producto
 */
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM productos WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

module.exports = {
    getProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
