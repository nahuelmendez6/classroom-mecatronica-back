import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Clase que maneja las operaciones de base de datos relacionadas con los usuarios
 */
class User {
    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.email - Email del usuario
     * @param {string} userData.password - Contraseña del usuario
     * @param {string} userData.name - Nombre del usuario
     * @param {string} userData.lastname - Apellido del usuario
     * @returns {Promise<Object>} Datos del usuario creado
     */


    static async searchUser(email) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
            return rows[0];
        } finally {
            connection.release();
        }
    }
}