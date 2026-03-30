const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const auth = require('../middleware/auth');

router.get('/', auth, clientesController.getClientes);
router.post('/', auth, clientesController.crearCliente);

module.exports = router;
