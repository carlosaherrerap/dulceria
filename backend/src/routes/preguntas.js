const express = require('express');
const router = express.Router();
const preguntasController = require('../controllers/preguntasController');
const auth = require('../middleware/auth');

router.get('/', auth, preguntasController.getPreguntas);
router.post('/', auth, preguntasController.crearPregunta);
router.delete('/:id', auth, preguntasController.eliminarPregunta);

module.exports = router;
