const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');
const auth = require('../middleware/auth');

router.post('/enviar', auth, anunciosController.enviarAnuncio);

module.exports = router;
