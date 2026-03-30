const express = require('express');
const router = express.Router();
const contactosController = require('../controllers/contactosController');
const auth = require('../middleware/auth');

router.get('/', auth, contactosController.getContactos);
router.post('/', auth, contactosController.crearContacto);
router.delete('/:id', auth, contactosController.eliminarContacto);

module.exports = router;
