import { pool } from '../../config/database.js';

class Session {
    /**
     * Registra un intento de inicio de sesión
     * @param {Object} attemptData - Datos del intento de login
     * @param {string} attemptData.email - Email usado en el intento
     * @param {string} attemptData.ip_address - IP del usuario
     * @param {string} attemptData.user_agent - User agent del navegador
     * @param {string} attemptData.status - Estado del intento ('success' o 'failed')
     * @param {string} attemptData.failure_reason - Razón del fallo (si aplica)
     * @param {number} attemptData.id_user - ID del usuario (si el intento fue exitoso)
     * @returns {Promise<number>} ID del intento registrado
     */
    static async recordLoginAttempt(attemptData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO login_attempt (email, ip_address, user_agent, status, failure_reason, id_user) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    attemptData.email,
                    attemptData.ip_address,
                    attemptData.user_agent,
                    attemptData.status,
                    attemptData.failure_reason,
                    attemptData.id_user
                ]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    /**
     * Crea una nueva sesión de usuario
     * @param {Object} sessionData - Datos de la sesión
     * @param {number} sessionData.id_user - ID del usuario
     * @param {string} sessionData.ip_address - IP del usuario
     * @param {string} sessionData.user_agent - User agent del navegador
     * @returns {Promise<number>} ID de la sesión creada
     */
    static async createSession(sessionData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO session (id_user, ip_address, user_agent, status) VALUES (?, ?, ?, "active")',
                [sessionData.id_user, sessionData.ip_address, sessionData.user_agent]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    /**
     * Cierra una sesión de usuario
     * @param {number} sessionId - ID de la sesión a cerrar
     * @returns {Promise<boolean>} true si la sesión se cerró correctamente
     */
    static async closeSession(sessionId) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'UPDATE session SET date_end = CURRENT_TIMESTAMP, status = "closed" WHERE id_session = ?',
                [sessionId]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    /**
     * Obtiene las sesiones activas de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} Lista de sesiones activas
     */
    static async getActiveSessions(userId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM session WHERE id_user = ? AND status = "active"',
                [userId]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    /**
     * Verifica si un usuario tiene demasiadas sesiones activas
     * @param {number} userId - ID del usuario
     * @param {number} maxSessions - Número máximo de sesiones permitidas
     * @returns {Promise<boolean>} true si el usuario excede el límite de sesiones
     */
    static async hasTooManyActiveSessions(userId, maxSessions = 3) {
        const activeSessions = await this.getActiveSessions(userId);
        return activeSessions.length >= maxSessions;
    }
}

export default Session; 