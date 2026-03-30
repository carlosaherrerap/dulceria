const express = require('express');
const router = express.Router();
const sugerenciasController = require('../controllers/sugerenciasController');
const auth = require('../middleware/auth');

router.get('/', auth, sugerenciasController.getSugerencias);
router.post('/', auth, sugerenciasController.crearSugerencia);

module.exports = router;
