const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const auth = require('../middleware/auth');

router.get('/', auth, reservasController.getReservas);
router.put('/:id/estado', auth, reservasController.actualizarEstadoReserva);

module.exports = router;
