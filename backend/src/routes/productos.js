const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const auth = require('../middleware/auth');

// Rutas de productos (protegidas por auth)
router.get('/', auth, productosController.getProductos);
router.post('/', auth, productosController.crearProducto);
router.put('/:id', auth, productosController.actualizarProducto);
router.delete('/:id', auth, productosController.eliminarProducto);

module.exports = router;
