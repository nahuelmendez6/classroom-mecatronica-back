import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';
import Session from './session.model.js';

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


    static async authUser(email, password)  {
        const user = await this.searchUser(email);
        if (!user) {
            throw new Error('Usurio no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contaseña incorrecta');
        }
        return user;
    }


    static async getUserById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM user WHERE id = ?', [id]);
            return rows[0];
        } finally { 
            connection.release();
        }
    }

    static async updateUser(id, userData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('UPDATE user SET ? WHERE id = ?', [userData, id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }   

    static async deleteUser(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM user WHERE id = ?', [id]);
            return result.affectedRows > 0; 
        } finally {
            connection.release();
        }
    }

    static async getAllUsers() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM user');
            return rows;
        } finally {
            connection.release();
        }       
    }

    static async createUser(userData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('INSERT INTO user SET ?', [userData]);
            return result.insertId;
        } finally { 
            connection.release();
        }
    }

    static async updateLastLogin(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('UPDATE user SET last_login = NOW() WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    /**
     * Autentica un usuario y registra la sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {Object} sessionInfo - Información de la sesión
     * @param {string} sessionInfo.ip_address - IP del usuario
     * @param {string} sessionInfo.user_agent - User agent del navegador
     * @returns {Promise<Object>} Datos del usuario y la sesión
     */
    static async authenticateAndCreateSession(email, password, sessionInfo) {
        const connection = await pool.getConnection();
        try {
            // Buscar usuario
            const [users] = await connection.query(
                'SELECT * FROM user WHERE email = ? AND is_active = 1',
                [email]
            );
            const user = users[0];

            // Registrar intento de login
            await Session.recordLoginAttempt({
                email,
                ip_address: sessionInfo.ip_address,
                user_agent: sessionInfo.user_agent,
                status: user ? 'success' : 'failed',
                failure_reason: user ? null : 'Usuario no encontrado',
                id_user: user?.id_user
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                await Session.recordLoginAttempt({
                    email,
                    ip_address: sessionInfo.ip_address,
                    user_agent: sessionInfo.user_agent,
                    status: 'failed',
                    failure_reason: 'Contraseña incorrecta',
                    id_user: user.id_user
                });
                throw new Error('Contraseña incorrecta');
            }

            // Verificar sesiones activas
            if (await Session.hasTooManyActiveSessions(user.id_user)) {
                throw new Error('Demasiadas sesiones activas');
            }

            // Crear nueva sesión
            const sessionId = await Session.createSession({
                id_user: user.id_user,
                ip_address: sessionInfo.ip_address,
                user_agent: sessionInfo.user_agent
            });

            // Obtener rol del usuario
            const [roles] = await connection.query(
                'SELECT r.* FROM role r WHERE r.id_role = ?',
                [user.id_role]
            );

            return {
                user: {
                    id_user: user.id_user,
                    email: user.email,
                    role: roles[0]
                },
                sessionId
            };
        } finally {
            connection.release();
        }
    }

    /**
     * Cierra la sesión de un usuario
     * @param {number} sessionId - ID de la sesión a cerrar
     * @returns {Promise<boolean>} true si la sesión se cerró correctamente
     */
    static async logout(sessionId) {
        return await Session.closeSession(sessionId);
    }

    /**
     * Obtiene las sesiones activas de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} Lista de sesiones activas
     */
    static async getActiveSessions(userId) {
        return await Session.getActiveSessions(userId);
    }
}

export default User;
