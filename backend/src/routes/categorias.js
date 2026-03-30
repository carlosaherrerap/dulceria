const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const auth = require('../middleware/auth');

router.get('/', auth, categoriasController.getCategorias);
router.post('/', auth, categoriasController.crearCategoria);

module.exports = router;
