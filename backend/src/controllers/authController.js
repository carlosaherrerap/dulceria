const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');
require('dotenv').config();

/**
 * Login para administradores y empleados
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar en administradores
        let userResult = await query('SELECT * FROM administradores WHERE email = $1', [email]);
        let role = 'admin';

        // Si no es admin, buscar en empleados
        if (userResult.rowCount === 0) {
            userResult = await query('SELECT * FROM empleados WHERE email = $1', [email]);
            role = 'empleado';
        }

        if (userResult.rowCount === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];

        // Verificar password con bcrypt
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, role: role, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, user: { id: user.id, nombre: user.nombre, role: role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
};

module.exports = { login };
